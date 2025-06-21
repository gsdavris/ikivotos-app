import { Dimensions, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ThemedView } from '@/components/ThemedView';
import FavoritesSVG from '@/components/svgs/FavoritesSVG';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('screen');

const NoFavorites = () => {
	const { t } = useTranslation();
	const router = useRouter();

	return (
		<ThemedView
			style={styles.noFavsContainer}
			accessibilityLiveRegion='polite'
			accessibilityLabel={t('empty_bookmarks_display')}>
			<View
				accessible
				accessibilityRole='image'
				accessibilityLabel={t('favorites_empty_image')}>
				<FavoritesSVG width={width - 48} />
			</View>
			<Text
				variant='headlineLarge'
				accessibilityRole='header'>
				{t('empty-bookmarks')}
			</Text>
			<Text variant='titleLarge'>{t('choose-heart')}</Text>
			<Button
				icon='home'
				mode='elevated'
				style={{ borderRadius: 32 }}
				labelStyle={{ fontSize: 16, lineHeight: 36 }}
				onPress={() => router.push('/')}
				accessibilityLabel={t('go-to-home')}
				accessibilityHint={t('tap_to_return_to_home')}>
				{t('go-to-home')}
			</Button>
		</ThemedView>
	);
};

export default NoFavorites;

const styles = StyleSheet.create({
	noFavsContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
		gap: 16,
	},
});
