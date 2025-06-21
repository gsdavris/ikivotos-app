import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Drawer, List, MD3DarkTheme } from 'react-native-paper';
import { usePathname } from 'expo-router';
import { Context } from '@/context';

const theme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		background: '#073b5d', // Dark background
		secondaryContainer: '#1e4f6d',
	},
};

const ThemeMainMenu = (props) => {
	const { state } = useContext(Context);
	const pathname = usePathname();
	const { t } = useTranslation();
	const [expandedItems, setExpandedItems] = useState({});
	const { lang, navigation } = props;

	const isActive = (item) => {
		// Convert the current route to a format that matches the menu structure
		if (item.type === 'taxonomy') {
			return pathname === `/category/${item.slug}`;
		} else if (item.url === '/') {
			return pathname === '/';
		} else {
			return pathname === `/page/${item.slug}`;
		}
	};

	// Toggle function for each item
	const toggleExpand = (id) => {
		setExpandedItems((prev) => ({
			...prev,
			[id]: !prev[id], // Toggle the specific item's state
		}));
	};

	const switchMenuByLang = () => {
		switch (lang) {
			case 'el':
				return 'main-menu';
			case 'en':
				return 'main-menu-en';
			case 'ro':
				return 'main-menu-ro';
			default:
				break;
		}
	};

	const mainMenu = state?.menus?.find((m) => m.slug === switchMenuByLang());

	const renderMenuItems = (items, level = 0) => {
		return items.map((item) => {
			if (item.children) {
				return (
					<List.Accordion
						theme={theme}
						key={item.id}
						title={item.label}
						accessibilityRole='menuitem'
						accessibilityState={{
							expanded: !!expandedItems[item.id],
							selected: isActive(item),
						}}
						accessibilityLiveRegion='polite'
						accessibilityLabel={item.label} // Announce menu item
						accessibilityHint={t('tap_to_expand_or_collapse')}
						expanded={!!expandedItems[item.id]}
						active={isActive(item)}
						onPress={() => toggleExpand(item.id)}
						onKeyPress={(e) => {
							if (e.nativeEvent.key === 'Enter') toggleExpand(item.id);
						}}
						onLongPress={() => {
							if (item.type === 'taxonomy') {
								navigation.navigate({
									name: 'category/[slug]',
									params: { slug: item.slug, searchQuery: '' },
								});
							}
						}} // Navigate on long press
						titleStyle={{
							fontFamily: theme.fonts.titleSmall.fontFamily,
							fontSize: theme.fonts.titleSmall.fontSize,
							letterSpacing: theme.fonts.titleSmall.letterSpacing,
							fontWeight: theme.fonts.titleSmall.fontWeight,
							lineHeight: theme.fonts.titleSmall.lineHeight,
							color: theme.colors.onSurface,
						}}
						style={{
							// paddingLeft: 10,
							minHeight: 48,
							minWidth: 48,
							borderRadius: 30,
							marginHorizontal: 10,
							backgroundColor: isActive(item)
								? theme.colors.secondaryContainer
								: theme.colors.background,
						}}>
						{renderMenuItems(item.children, level + 1)}
					</List.Accordion>
				);
			}

			return (
				<Drawer.Item
					{...props}
					theme={theme}
					key={item.id}
					label={item.label}
					style={{ minHeight: 48, minWidth: 48 }} // Enlarge tap area
					accessibilityRole='menuitem'
					accessibilityState={{ selected: isActive(item) }}
					accessibilityLabel={item.label} // Announce menu item
					accessibilityHint={t('tap_to_navigate')}
					active={isActive(item)}
					onPress={() =>
						navigation.navigate(
							item.type === 'taxonomy'
								? {
										name: 'category/[slug]',
										params: { slug: item.slug, searchQuery: '' },
								  }
								: item.url === '/'
								? 'index'
								: {
										name: 'page/[slug]',
										params: { slug: item.slug, title: item.label },
								  }
						)
					}
				/>
			);
		});
	};

	return (
		<Drawer.Section
			{...props}
			theme={theme}
			style={{ gap: 8 }}
			accessibilityRole='menu'
			accessibilityLabel={t('main_navigation_menu')}>
			{mainMenu &&
				mainMenu['menu-items'] &&
				renderMenuItems(mainMenu['menu-items'])}
		</Drawer.Section>
	);
};

export default ThemeMainMenu;
