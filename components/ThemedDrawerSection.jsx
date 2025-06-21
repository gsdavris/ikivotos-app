import { useState } from 'react';
import { View, Image, StyleSheet, AccessibilityInfo } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Drawer, MD3DarkTheme } from 'react-native-paper';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import ThemeMainMenu from '@/components/ThemeMainMenu';
import { Sizes } from '@/constants/Sizes';

const theme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		background: '#073B5D', // Dark background
		secondaryContainer: '#1e4f6d',
	},
};

const ThemedDrawerSection = (props) => {
	const { t, i18n } = useTranslation();
	const { navigation } = props;
	const [active, setActive] = useState(i18n.language);
	const changeLanguage = (lang) => {
		i18n.changeLanguage(lang);
		setActive(lang);
		navigation.navigate({ name: 'index' });
		AccessibilityInfo.announceForAccessibility(
			t(`language_changed_to_${lang}`)
		);
	};

	return (
		<DrawerContentScrollView
			theme={theme}
			{...props}
			accessibilityLabel={t('site_navigation_and_settings')}>
			{/* Logo Area */}
			<View
				style={styles.logoContainer}
				importantForAccessibility='no-hide-descendants'>
				<Image
					source={require('@/assets/images/logo.jpg')}
					style={styles.logo}
					resizeMode='contain'
					accessibilityLabel={t('logo_alt_text')} // Add translated alt text
				/>
			</View>
			<ThemeMainMenu
				{...props}
				lang={i18n?.language}
			/>
			<Drawer.Section
				title={t('change_language')}
				theme={theme}
				style={{ paddingBottom: Sizes.BOTTOM_APPBAR_HEIGHT }}
				accessibilityLiveRegion='polite'
				accessibilityRole='menu'
				accessibilityLabel={t('language_selection')}>
				<Drawer.Item
					theme={theme}
					icon='translate'
					label='Ελ'
					active={active === 'el'}
					onPress={() => {
						changeLanguage('el');
						navigation.closeDrawer();
					}}
					accessibilityLabel={t('language_el')}
					accessibilityHint={t('change_language')}
					accessibilityRole='button'
					accessibilityState={{ checked: active === 'el' }}
				/>
				<Drawer.Item
					theme={theme}
					icon='translate'
					label='En'
					active={active === 'en'}
					onPress={() => {
						changeLanguage('en');
						navigation.closeDrawer();
					}}
					accessibilityLabel={t('language_en')}
					accessibilityHint={t('change_language')}
					accessibilityRole='button'
					accessibilityState={{ checked: active === 'en' }}
				/>
				<Drawer.Item
					theme={theme}
					icon='translate'
					label='Ro'
					active={active === 'ro'}
					onPress={() => {
						changeLanguage('ro');
						navigation.closeDrawer();
					}}
					accessibilityLabel={t('language_ro')}
					accessibilityHint={t('change_language')}
					accessibilityRole='button'
					accessibilityState={{ checked: active === 'ro' }}
				/>
			</Drawer.Section>
		</DrawerContentScrollView>
	);
};

export default ThemedDrawerSection;

const styles = StyleSheet.create({
	logoContainer: {
		alignItems: 'center',
		paddingVertical: 20,
		marginBottom: 16,
		backgroundColor: '#073B5D', // Optional: Background color
	},
	logo: {
		// width: 120, // Adjust size as needed
		// height: 50, // Adjust size as needed
		width: '100%',
	},
});
