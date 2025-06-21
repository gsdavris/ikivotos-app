import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
	MD3LightTheme as PaperDefaultTheme,
	MD3DarkTheme as PaperDarkTheme,
	adaptNavigationTheme,
	PaperProvider,
} from 'react-native-paper';
import { I18nextProvider } from 'react-i18next';
import i18next from '@/i18n';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ContextProvider } from '@/context';
import SnackMessage from '@/components/SnackMessage';

const LightTheme = {
	...PaperDefaultTheme,
	colors: {
		...PaperDefaultTheme.colors,
	},
};

const DarkTheme = {
	...PaperDarkTheme,
	colors: {
		...PaperDarkTheme.colors,
		background: '#073b5d',
	},
};

const { LightTheme: NavLightTheme, DarkTheme: NavDarkTheme } =
	adaptNavigationTheme({
		reactNavigationLight: DefaultTheme,
		reactNavigationDark: DefaultTheme,
	});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ContextProvider>
				<I18nextProvider i18n={i18next}>
					<PaperProvider theme={LightTheme}>
						<ThemeProvider value={NavLightTheme}>
							<Stack>
								<Stack.Screen
									name='(drawer)'
									options={{ headerShown: false }}
								/>
								<Stack.Screen name='+not-found' />
							</Stack>
							<SnackMessage />
							<StatusBar style={'light'} />
						</ThemeProvider>
					</PaperProvider>
				</I18nextProvider>
			</ContextProvider>
		</GestureHandlerRootView>
	);
}
