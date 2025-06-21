import { IconButton, useTheme } from 'react-native-paper';
import { StyleSheet, View, AccessibilityInfo, Share } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '@/context';
import { useTranslation } from 'react-i18next';

const PostHeaderRight = ({ post, mode }) => {
	const { state, dispatch } = useContext(Context);
	const [isFav, setIsFav] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const theme = useTheme();
	const { t } = useTranslation();

	const { favorites } = state;

	const handlePressFav = () => {
		if (!isFav) {
			dispatch({ type: 'ADD_FAVORITES', payload: post });
			AccessibilityInfo.announceForAccessibility(t('added_to_favorites'));
		} else {
			dispatch({ type: 'REMOVE_FAVORITES', payload: post });
			AccessibilityInfo.announceForAccessibility(t('removed_from_favorites'));
		}
	};

	const handleShare = async () => {
		setIsLoading(true);

		try {
			const result = await Share.share({
				message: `${post?.title}\n\n${post?.link}`,
				title: t('share_post'),
			});

			setIsLoading(false);

			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					AccessibilityInfo.announceForAccessibility(
						`${t('shared_via')} ${result.activityType}`
					);
				} else {
					AccessibilityInfo.announceForAccessibility(t('post_shared'));
				}
			} else if (result.action === Share.dismissedAction) {
				AccessibilityInfo.announceForAccessibility(t('share_cancelled'));
			}
		} catch (error) {
			setIsLoading(false);
			dispatch({
				type: 'UPDATE_MESSAGE',
				payload: {
					type: 'error',
					title: t('error'),
					label: err?.message,
				},
			});
			AccessibilityInfo.announceForAccessibility(
				`${t('error')}: ${error.message}`
			);
		}
	};

	const checkIsFav = () => {
		if (favorites.filter((value) => value.id === post.id).length > 0) {
			setIsFav(true);
		} else {
			setIsFav(false);
		}
	};

	const storeData = async (value) => {
		setIsLoading(true);

		try {
			const jsonValue = JSON.stringify(value);
			await AsyncStorage.setItem('favorites', jsonValue);
			setIsLoading(false);
		} catch (err) {
			// saving error
			setIsLoading(false);
			dispatch({
				type: 'UPDATE_MESSAGE',
				payload: {
					type: 'error',
					title: t('error'),
					label: err?.message,
				},
			});
			AccessibilityInfo.announceForAccessibility(
				`${t('error')}: ${err?.message}`
			);
		}
	};

	useEffect(() => {
		(async () => {
			await storeData(favorites);
		})();
		if (post) {
			checkIsFav();
		}
	}, [favorites]);

	return (
		<View style={styles.headerButtonsContainer}>
			<IconButton
				mode={mode}
				size={32}
				icon='share-variant-outline'
				iconColor={theme.colors.primary}
				onPress={handleShare}
				accessibilityLabel={`${t('share_post')} ${post?.title}`}
				accessibilityHint={t('tap_to_share_post')}
			/>
			<IconButton
				mode={mode}
				size={32}
				icon={isFav ? 'heart' : 'heart-outline'}
				iconColor={theme.colors.primary}
				onPress={handlePressFav}
				disabled={isLoading}
				accessibilityLabel={
					isFav
						? `${t('remove_favorites')} ${post?.title}`
						: `${t('add_favorites')} ${post?.title}`
				}
				accessibilityHint={t('tap_to_add_or_remove_favorites')}
				accessibilityState={{ disabled: isLoading }}
			/>
		</View>
	);
};

export default PostHeaderRight;

const styles = StyleSheet.create({
	headerButtonsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
});
