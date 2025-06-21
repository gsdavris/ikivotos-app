import { StyleSheet } from 'react-native';
import { useContext, Fragment } from 'react';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import ScrollView from '@/components/ScrollView';
import ThemeCard from '@/components/ThemeCard';
import { Context } from '@/context';
import { Sizes } from '@/constants/Sizes';
import { useTranslation } from 'react-i18next';
import ThemedFooter from '@/components/ThemedFooter';

export default function HomeScreen() {
	const theme = useTheme();
	const { state } = useContext(Context);
	const { t, i18n } = useTranslation();

	const lang = i18n.language;

	return (
		<>
			<ScrollView
				contentContainerStyle={styles.container}
				accessibilityLiveRegion='polite'>
				{state?.homepage &&
					state?.homepage[lang].map((section, i) => (
						<Fragment key={i}>
							{section?.title && (
								<Text
									variant='headlineLarge'
									style={styles.titleContainer}
									accessibilityRole='header'>
									{section?.title}
								</Text>
							)}
							{section?.posts?.map((post) => (
								<ThemeCard
									key={post.id}
									post={post}
									full={section.layout === 'full'}
									horizontal={section.layout === 'horizontal'}
									accessibilityLabel={post?.title}
								/>
							))}
						</Fragment>
					))}
				{state?.homepage && <ThemedFooter />}
			</ScrollView>
			{!state?.homepage && (
				<ActivityIndicator
					size={90}
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: [{ translateX: -45 }, { translateY: -45 }],
					}}
					color={theme.colors.primary}
					accessibilityLabel={t('loading-content')}
				/>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		paddingBottom: Sizes.BOTTOM_APPBAR_HEIGHT + 16,
	},
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginVertical: 18,
	},
});
