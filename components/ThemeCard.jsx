import { useState } from 'react';
import { Card, Text, IconButton, useTheme, Chip } from 'react-native-paper';
import { StyleSheet, Dimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import 'moment/locale/el';
import 'moment/locale/en-gb';
import 'moment/locale/ro';
import { useNavigation } from '@react-navigation/native';
import PostHeaderRight from './PostHeaderRight';

const { width } = Dimensions.get('screen');

const ThemeCard = ({
	mode = 'elevated',
	title = 'Card Title',
	subtitle = 'Card Subtitle',
	post,
	right,
	horizontal = false,
	full = false,
}) => {
	const theme = useTheme();
	const navigation = useNavigation();
	const { t, i18n } = useTranslation();

	const { language } = i18n;

	const getLocalDate = () => {
		switch (language) {
			case 'el':
				return 'el';
			case 'en':
				return 'en-gb';
			case 'ro':
				return 'ro';

			default:
				return 'en-gb';
		}
	};

	return (
		<Card
			mode={mode}
			theme={theme}
			accessible={false}>
			<View style={horizontal && styles.rowContainer}>
				<Card.Cover
					style={
						horizontal
							? styles.imageHorizontal
							: full
							? styles.imageFull
							: styles.image
					}
					source={{
						uri: post ? post.featured_media.url : 'https://picsum.photos/700',
					}}
					accessibilityLabel={
						post
							? `${t('featured_image')} : ${post?.title}`
							: t('featured_image')
					}
					accessibilityRole='image'
				/>
				<View style={horizontal && styles.textContainer}>
					<Card.Title
						subtitle={
							post
								? moment(post.date_gmt)
										.locale(getLocalDate())
										.format('D MMM YYYY')
								: subtitle
						}
						right={
							!post
								? right
								: () => (
										<PostHeaderRight
											mode='contained-tonal'
											key={post.id}
											post={post}
										/>
								  )
						}
						accessibilityLabel={moment(post?.date_gmt)
							.locale(getLocalDate())
							.format('D MMM YYYY')}
						accessibilityRole='header'
					/>
					<Card.Content style={styles.cardContent}>
						<Text
							numberOfLines={horizontal ? 3 : 4}
							ellipsizeMode='tail'
							variant={horizontal ? 'titleMedium' : 'titleLarge'}
							accessibilityRole='link'
							accessibilityHint={t('tap_to_view_full_article')}
							onPress={() => {
								if (post) {
									navigation.navigate('post/[slug]', {
										slug: post?.slug,
										post: JSON.stringify(post),
									});
								}
							}}
							style={{
								color: theme.colors.primary,
							}}>
							{post ? post.title : title}
						</Text>
						{/* <Text
							variant='titleSmall'
							accessibilityLabel={`${t('author')} : ${post?.author?.name} : ${
								post?.title
							}`}>
							{post ? post?.author?.name : subtitle}
						</Text> */}
					</Card.Content>
					<Card.Actions style={{ flexDirection: 'row' }}>
						{post ? (
							<Chip
								mode='flat'
								style={{
									minHeight: 48,
									justifyContent: 'center',
									alignItems: 'center',
								}}
								textStyle={{
									fontSize: 16,
									lineHeight: 36,
								}}
								accessibilityLabel={`${t('category')} : ${
									post.categories[0]?.name
								}  : ${post?.title}`}
								accessibilityRole='text'>
								{post.categories[0]?.name}
							</Chip>
						) : (
							<Chip
								mode='flat'
								style={{
									minHeight: 48,
									justifyContent: 'center',
									alignItems: 'center',
								}}
								textStyle={{
									fontSize: 16,
									lineHeight: 36,
								}}
								accessibilityLabel={t('cancel')}
								accessibilityRole='button'>
								Cancel
							</Chip>
						)}
					</Card.Actions>
				</View>
			</View>
		</Card>
	);
};

export default ThemeCard;

const styles = StyleSheet.create({
	rowContainer: {
		flexDirection: 'row', // Ensures the image and text are side by side
		alignItems: 'center',
	},
	image: {
		width: width - 64, // Adjust image width
		top: -16,
		marginHorizontal: 'auto',
	},
	imageHorizontal: {
		width: '40%', // Adjust image width
		height: 'auto',
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
	},
	imageFull: {
		width: '100%', // Adjust image width
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	textContainer: {
		flex: 1, // Takes remaining space
	},
	cardContent: {
		gap: 4,
	},
});
