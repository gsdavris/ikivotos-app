import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import { IconButton, MD3DarkTheme } from 'react-native-paper';
import ThemedDrawerSection from '@/components/ThemedDrawerSection';
import { Drawer } from 'expo-router/drawer';
import ThemedBottomBar from '@/components/ThemedBottomBar';
import { useRef } from 'react';

const darkTheme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		background: '#073B5D',
	},
};

export default function DrawerLayout() {
	const { t } = useTranslation();
	const navigationRef = useRef(null);

	return (
		<>
			<Drawer
				screenOptions={{
					drawerStyle: { backgroundColor: darkTheme.colors.background },
					drawerContentStyle: {
						backgroundColor: darkTheme.colors.background,
					},
					headerTitleAlign: 'center',
					drawerHideStatusBarOnOpen: true,
					headerLeft: () => (
						<IconButton
							icon='menu'
							iconColor={darkTheme.colors.onSurface}
							size={32}
							onPress={() => {
								if (navigationRef.current) {
									navigationRef.current.toggleDrawer();
								}
							}}
							accessible
							accessibilityLabel={t('open_navigation_menu')}
						/>
					),
				}}
				drawerContent={(props) => {
					// Store the navigation object in our ref
					navigationRef.current = props.navigation;
					return <ThemedDrawerSection {...props} />;
				}}
				backBehavior='history'>
				<Drawer.Screen
					name='category/[slug]'
					options={{
						drawerLabel: 'Category',
						headerStyle: { backgroundColor: darkTheme.colors.background },
						headerTintColor: darkTheme.colors.onBackground,
					}}
				/>
				<Drawer.Screen
					name='post/[slug]'
					options={{
						drawerLabel: 'Post',
						headerTransparent: true,
						headerTitle: '',
						headerLeft: '',
					}}
				/>
				<Drawer.Screen
					name='page/[slug]'
					options={{
						drawerLabel: 'Page',
						headerTransparent: true,
						headerTitle: '',
						headerLeft: '',
					}}
				/>
				<Drawer.Screen
					name='index'
					options={{
						drawerLabel: 'Home',
						// headerTitle: t('i Kivotos'),
						headerTitle: () => (
							<Image
								source={require('@/assets/images/logo.jpg')}
								style={{ height: 32 }}
								resizeMode='contain'
								accessibilityLabel={t('logo_alt_text')} // Add translated alt text
							/>
						),
						headerStyle: { backgroundColor: darkTheme.colors.background },
						headerTintColor: darkTheme.colors.onBackground,
					}}
				/>
				<Drawer.Screen
					name='favorites'
					options={{
						drawerLabel: 'Favorites',
						headerTitle: t('favorites'),
						headerStyle: { backgroundColor: darkTheme.colors.background },
						headerTintColor: darkTheme.colors.onBackground,
					}}
				/>
			</Drawer>
			<ThemedBottomBar theme={darkTheme} />
		</>
	);
}
