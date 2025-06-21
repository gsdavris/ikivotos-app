import React from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { Text, Button, Surface, MD3DarkTheme, List } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';
import { useContext } from 'react';
import { Context } from '@/context';

const theme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		background: '#073B5D', // Dark background
		secondaryContainer: '#1e4f6d',
	},
};

const ThemedFooter = () => {
	const { t, i18n } = useTranslation(); // Get translation function
	const { state } = useContext(Context);

	const switchMenuByLang = () => {
		switch (i18n?.language) {
			case 'el':
				return 'footer';
			case 'en':
				return 'footer-en';
			case 'ro':
				return 'footer-ro';
			default:
				break;
		}
	};

	const footerMenu = state?.menus?.find((m) => m.slug === switchMenuByLang());

	return (
		<Surface
			elevation={3}
			style={[styles.footer, { backgroundColor: theme.colors.background }]}>
			{/* Logo */}
			<Image
				source={require('@/assets/images/logo.jpg')}
				style={styles.logo}
				resizeMode='contain'
				accessibilityLabel={t('app_logo')}
			/>
			<List.Section
				theme={theme}
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'row',
					flexWrap: 'wrap',
				}}>
				<List.Item
					style={{ paddingHorizontal: '20' }}
					theme={theme}
					onPress={() => Linking.openURL('mailto:info@ikivotos.gr')}
					title='info@ikivotos.gr'
					left={() => (
						<List.Icon
							theme={theme}
							icon='email-outline'
						/>
					)}
				/>
				{/* <List.Item
					style={{ paddingHorizontal: '20' }}
					theme={theme}
					onPress={() => Linking.openURL('tel:+302106924659')}
					title='+30 210 692 4659'
					left={() => (
						<List.Icon
							theme={theme}
							icon='phone-outline'
						/>
					)}
				/> */}
			</List.Section>
			{/* Footer Menu */}
			<View style={styles.menu}>
				{footerMenu &&
					footerMenu['menu-items'].map((item) => (
						<Link
							key={item.slug}
							href={
								item.type === 'taxonomy'
									? {
											pathname: 'category/[slug]',
											params: { slug: item.slug, searchQuery: '' },
									  }
									: item.url === '/'
									? 'index'
									: {
											pathname: 'page/[slug]',
											params: { slug: item.slug, title: item.label },
									  }
							}
							asChild>
							<Button
								mode='text'
								theme={theme}
								labelStyle={{
									fontSize: 16,
									lineHeight: 36,
								}}
								accessibilityRole='button'
								accessibilityLabel={item.label}
								accessibilityHint={`${t('navigate_to')} ${item.label}`}>
								{item.label}
							</Button>
						</Link>
					))}
			</View>

			{/* Copyright */}
			<Text
				theme={theme}
				variant='bodySmall'
				style={styles.copyright}
				accessibilityRole='text'
				accessibilityLabel={`${t('copyright')} ${new Date().getFullYear()}`}>
				© {new Date().getFullYear()} {t('company_name')}.{' '}
				{t('all_rights_reserved')}
			</Text>
		</Surface>
	);
};

export default ThemedFooter;

const styles = StyleSheet.create({
	footer: {
		padding: 16,
		marginTop: 20,
		// borderRadius: theme.roundness,
		marginHorizontal: -16,
		marginBottom: -20,
		alignItems: 'center',
		borderTopWidth: 1,
		borderTopColor: 'rgba(255, 255, 255, 0.2)',
	},
	logo: {
		width: 120,
		height: 40,
		marginBottom: 10,
	},
	menu: {
		flexDirection: 'column',
		justifyContent: 'center',
		marginBottom: 8,
	},
	copyright: {
		opacity: 0.7,
	},
});
