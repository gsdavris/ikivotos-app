import { useState, useEffect, useRef, useContext } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Platform } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { Context } from '@/context';

export const ThemedWebView = ({ uri, initialHeight = 200 }) => {
	const { dispatch } = useContext(Context);
	const [webViewHeight, setWebViewHeight] = useState(initialHeight);
	const [isLoading, setIsLoading] = useState(true);
	const [isPageLoaded, setIsPageLoaded] = useState(false);
	const theme = useTheme();
	const { t } = useTranslation();
	const heightCheckCount = useRef(0);
	const lastHeight = useRef(0);
	const hasSignificantHeight = useRef(false);
	const webViewRef = useRef(null);

	useEffect(() => {
		setWebViewHeight(initialHeight);
		setIsLoading(true);
		setIsPageLoaded(false);
		heightCheckCount.current = 0;
		lastHeight.current = 0;
		hasSignificantHeight.current = false;
	}, [uri, initialHeight]);

	// Only hide the loader when the page is loaded AND we have a significant height
	useEffect(() => {
		if (isPageLoaded && hasSignificantHeight.current) {
			// Add a small delay to ensure content is fully rendered
			const timer = setTimeout(() => {
				setIsLoading(false);
			}, 700);

			return () => clearTimeout(timer);
		}
	}, [isPageLoaded, webViewHeight]);

	const injectedJavaScript = `
    var lastHeight = 0;
    var checkCount = 0;
    var checkInterval;

	// Video fixing code - Add this
    (function() {
      const videos = document.getElementsByTagName('video');
      for (let i = 0; i < videos.length; i++) {
        videos[i].style.width = '100%';
        videos[i].style.height = 'auto';
		videos[i].style.minHeight = '300px';
        videos[i].style.maxWidth = '100%';
        videos[i].setAttribute('playsinline', '');
      }
      
      // Also handle iframes (like YouTube embeds)
      const iframes = document.getElementsByTagName('iframe');
      for (let i = 0; i < iframes.length; i++) {
        iframes[i].style.width = '100%';
        iframes[i].style.minHeight = '300px';
        iframes[i].style.maxWidth = '100%';
      }
      
      // Add global CSS to ensure videos stay contained
      const style = document.createElement('style');
      style.textContent = 'video, iframe { width: 100% !important; height: auto !important; max-width: 100% !important; }';
      document.head.appendChild(style);
    })();

    function updateHeight() {
        const height = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );

        if (Math.abs(height - lastHeight) > 10 || checkCount < 5) {
             window.ReactNativeWebView.postMessage(JSON.stringify({type: 'height', height: height}));
            lastHeight = height;
        }
        checkCount++;

        if (checkCount > 20 && checkInterval) {
            clearInterval(checkInterval);
			// Final height check
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'final', height: lastHeight}));
        }
    }
    
    // Initial calculation
    updateHeight();
    
   // Calculate after full page load
    window.addEventListener('load', function() {
      updateHeight();
      // Extra check after a slight delay for images and dynamic content
      setTimeout(updateHeight, 500);
      
      // Periodic checks, but with limits
      checkInterval = setInterval(updateHeight, 1000);
    });
    
    // Intercept all link clicks
    document.addEventListener('click', function(e) {
      var target = e.target;
      // Find closest <a> tag if click was on a child element
      while (target && target.tagName !== 'A') {
        target = target.parentNode;
        if (!target) break;
      }
      
      if (target && target.tagName === 'A' && target.href) {
        e.preventDefault();
        window.ReactNativeWebView.postMessage(JSON.stringify({type: 'link', url: target.href}));
        return false;
      }
    }, true);
    
    true;
  `;

	const onMessageHandler = (event) => {
		try {
			const data = JSON.parse(event.nativeEvent.data);

			if (data.type === 'link') {
				// Open link in system browser
				WebBrowser.openBrowserAsync(data.url);
				return;
			}

			if (data.type === 'final') {
				if (data.height > 100) {
					setWebViewHeight(data.height);
				}
				hasSignificantHeight.current = true;
				return;
			}

			if (data.type === 'height') {
				const height = data.height;

				// Only update height if it's reasonable and not the same as before
				if (height > 100 && height !== lastHeight.current) {
					lastHeight.current = height;
					setWebViewHeight(height);

					// Mark that we have a significant height
					if (height > initialHeight * 0.8) {
						hasSignificantHeight.current = true;
					}
				}

				// Increment check count
				heightCheckCount.current += 1;
			}
		} catch (error) {
			// Handle legacy message format or parse errors
			const height = parseInt(event.nativeEvent.data);
			if (!isNaN(height) && height > 100 && height !== lastHeight.current) {
				lastHeight.current = height;
				setWebViewHeight(height);
				if (height > initialHeight * 0.8) {
					hasSignificantHeight.current = true;
				}
			}
		}
	};

	// For iOS, we need to use onShouldStartLoadWithRequest
	const onShouldStartLoadWithRequest = (request) => {
		// Allow the initial page to load
		if (request.url === uri) {
			return true;
		}

		// Check if this is a link navigation (not a resource load)
		const isLink =
			request.navigationType === 'click' ||
			request.navigationType === 'formsubmit';

		if (isLink) {
			WebBrowser.openBrowserAsync(request.url);
			return false; // Don't load in WebView
		}

		// Allow other resources to load (images, scripts, etc.)
		return true;
	};

	return (
		<View style={{ height: webViewHeight, position: 'relative' }}>
			<WebView
				source={{ uri }}
				ref={webViewRef}
				style={{ opacity: isLoading ? 0 : 1, height: webViewHeight }}
				scrollEnabled={false}
				injectedJavaScript={injectedJavaScript}
				onMessage={onMessageHandler}
				onShouldStartLoadWithRequest={
					Platform.OS === 'ios' ? onShouldStartLoadWithRequest : undefined
				}
				allowsInlineMediaPlayback={true} //  iOS
				mediaPlaybackRequiresUserAction={false} // if you want videos to autoplay
				domStorageEnabled={true} //  better web compatibility
				javaScriptEnabled={true} // Make sure this is true
				onLoadEnd={() => {
					// Just mark the page as loaded, but don't hide the loader yet
					setIsPageLoaded(true);

					// If we don't have a height yet, force one more check
					if (!hasSignificantHeight.current) {
						setTimeout(() => {
							if (!hasSignificantHeight.current) {
								// If still no height, just show the content anyway
								hasSignificantHeight.current = true;
								setIsLoading(false);
							}
						}, 1500);
					}
				}}
				onError={(syntheticEvent) => {
					const { nativeEvent } = syntheticEvent;
					if (nativeEvent?.description === 'net::ERR_INTERNET_DISCONNECTED') {
						dispatch({
							type: 'UPDATE_MESSAGE',
							payload: {
								type: 'error',
								title: t('error'),
								label: t('connection_error'),
							},
						});
					} else {
						dispatch({
							type: 'UPDATE_MESSAGE',
							payload: {
								type: 'error',
								title: t('error'),
								label: nativeEvent?.title,
							},
						});
					}
					// Hide loader on error after a delay
					setTimeout(() => setIsLoading(false), 500);
				}}
			/>
			{isLoading && (
				<View style={[styles.loaderContainer, { height: initialHeight }]}>
					<ActivityIndicator
						size={90}
						color={theme.colors.primary}
						accessibilityLabel={t('loading-content')}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	loaderContainer: {
		position: 'absolute',
		width: '100%',
		top: 0,
		justifyContent: 'flex-start',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
});
