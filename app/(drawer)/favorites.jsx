import { useContext } from 'react';
import { FlatList } from 'react-native';
import ThemeCard from '@/components/ThemeCard';
import { Context } from '@/context';
import { Sizes } from '@/constants/Sizes';
import { useTranslation } from 'react-i18next';
import NoFavorites from '@/components/NoFavorites';

export default function FavoritesScreen() {
	const { state } = useContext(Context);
	const { t } = useTranslation();
	const favorites = state?.favorites;

	return (
		<>
			{favorites && favorites?.length !== 0 ? (
				<FlatList
					showsVerticalScrollIndicator={false}
					style={{ flex: 1 }}
					contentContainerStyle={{
						gap: 16,
						padding: 16,
						paddingBottom: 16 + Sizes.BOTTOM_APPBAR_HEIGHT,
					}}
					data={favorites}
					renderItem={({ item }) => (
						<ThemeCard
							post={item}
							horizontal
						/>
					)}
					keyExtractor={(item) => item.id.toString()}
					accessibilityLabel={t('favorites_list')}
				/>
			) : (
				<NoFavorites />
			)}
		</>
	);
}
