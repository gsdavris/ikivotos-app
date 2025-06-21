import { Dimensions, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native-paper';
import { Sizes } from '@/constants/Sizes';
import { useTranslation } from 'react-i18next';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import ThemedFooter from '@/components/ThemedFooter';
import { rootUri } from '@/constants/requests';
import { ThemedWebView } from '../../../components/ThemedWebView';

const height = Dimensions?.get('screen')?.height;

export default function PageScreen() {
	const { slug, title } = useLocalSearchParams();
	const { t } = useTranslation();

	return (
		<>
			<ParallaxScrollView
				bottom={Sizes.BOTTOM_APPBAR_HEIGHT - 4}
				headerBackgroundColor={{ light: '#073B5D', dark: '#353636' }}
				headerImage={
					<Image
						resizeMode='contain'
						style={{ flex: 1, margin: 'auto' }}
						source={require('@/assets/images/logo.jpg')}
						accessibilityRole='image'
						accessibilityLabel={t('app_logo')}
					/>
				}>
				<ThemedView>
					<Text
						variant='headlineMedium'
						style={{ textAlign: 'center' }}
						accessibilityRole='header'>
						{title || 'Page'}
					</Text>
				</ThemedView>
				<ThemedWebView
					initialHeight={height - Sizes.HEADER_HEIGHT * 2}
					key={slug}
					uri={rootUri + slug + '/?app=true'}
				/>
				<ThemedFooter />
			</ParallaxScrollView>
		</>
	);
}
