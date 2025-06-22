import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, FAB, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sizes } from '@/constants/Sizes';
import { useRouter, usePathname } from 'expo-router';
import Modal from '@/components/Modal';
import SearchView from '@/components/SearchView';
import { useTranslation } from 'react-i18next';

const ThemedBottomBar = ({ theme }) => {
	const { bottom } = useSafeAreaInsets();
	const router = useRouter();
	const pathname = usePathname();
	const [modalVisible, setModalVisible] = useState(false);
	// const theme = useTheme();
	const { t } = useTranslation();

	return (
		<Appbar
			theme={theme}
			style={[
				styles.bottom,
				{
					height: Sizes.BOTTOM_APPBAR_HEIGHT + bottom,
					backgroundColor: theme.colors.background,
				},
			]}
			safeAreaInsets={{ bottom }}
			accessible={true}
			accessibilityRole='header'
			accessibilityLabel={t('navigation_toolbar')}
			elevated>
			{router.canGoBack() && (
				<Appbar.BackAction
					onPress={() => {
						router.back();
					}}
					style={{ minHeight: 56, minWidth: 56 }}
					accessibilityLabel={t('go_back')}
					accessibilityRole='button'
					accessibilityHint={t('returns_to_the_previous_screen')}
				/>
			)}
			<View
				style={styles.fabContainer}
				accessible={true}
				accessibilityLabel={t('action_buttons')}>
				<FAB
					mode='elevated'
					size='medium'
					theme={theme}
					icon={modalVisible ? 'magnify-expand' : 'magnify'}
					variant={modalVisible ? 'primary' : 'secondary'}
					onPress={() => {
						setModalVisible(true);
					}}
					accessibilityLabel={t('search')}
					accessibilityHint={t('opens_search_modal')}
					accessibilityState={{ expanded: modalVisible }}
				/>
				<FAB
					mode='elevated'
					size='medium'
					theme={theme}
					icon={pathname === '/favorites' ? 'bookmark' : 'bookmark-outline'}
					variant={pathname === '/favorites' ? 'primary' : 'secondary'}
					onPress={() => {
						router.push('favorites');
					}}
					accessibilityLabel={t('favorites_page')}
					accessibilityHint={t('navigate_to_favorites_page')}
					accessibilityState={{ selected: pathname === '/favorites' }}
				/>
			</View>
			<Modal
				visible={modalVisible}
				onDismiss={() => setModalVisible(false)}
				accessibilityViewIsModal={true}
				accessibilityLiveRegion='polite'>
				<SearchView onClose={() => setModalVisible(false)} />
			</Modal>
		</Appbar>
	);
};

export default ThemedBottomBar;

const styles = StyleSheet.create({
	bottom: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
	},
	fab: {
		position: 'absolute',
		right: 16,
	},
	fabContainer: {
		flex: 1,
		paddingHorizontal: 16,
		flexDirection: 'row',
		gap: 16,
		justifyContent: 'flex-end',
	},
});
