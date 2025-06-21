import { StyleSheet, Image, Dimensions } from 'react-native';
import { useLayoutEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import PostHeaderRight from '@/components/PostHeaderRight';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedView } from '@/components/ThemedView';
import { Sizes } from '@/constants/Sizes';
import moment from 'moment';
import 'moment/locale/el';
import 'moment/locale/en-gb';
import 'moment/locale/ro';
import ThemedFooter from '@/components/ThemedFooter';
import { ThemedWebView } from '../../../components/ThemedWebView';

const { height } = Dimensions.get('screen');

export default function PostScreen() {
	const navigation = useNavigation();
	const { post: postString, slug } = useLocalSearchParams();
	const post = postString ? JSON.parse(postString) : null;
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

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () =>
				post && (
					<PostHeaderRight
						key={post.id}
						post={post}
						mode='contained'
					/>
				),
		});
	}, [post]);

	return (
		<>
			<ParallaxScrollView
				headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
				bottom={Sizes.BOTTOM_APPBAR_HEIGHT - 4}
				headerImage={
					<Image
						resizeMode='cover'
						style={{ flex: 1 }}
						source={{
							uri: post ? post.featured_media.url : 'https://picsum.photos/700',
						}}
						accessibilityRole='image'
						accessibilityLabel={t('post_image')}
					/>
				}>
				<ThemedView style={styles.categoriesContainer}>
					{post?.categories?.map((category) => (
						<Button
							key={category.id}
							icon='label-variant-outline'
							mode='text'
							labelStyle={{ fontSize: 16, lineHeight: 36 }}
							onPress={() =>
								navigation.navigate({
									name: 'category/[slug]',
									params: { slug: category.slug },
								})
							}
							accessibilityLabel={`${t('category')}: ${category.name}`}>
							{category.name}
						</Button>
					))}
				</ThemedView>
				<ThemedView style={styles.titleContainer}>
					<Text
						variant='headlineMedium'
						accessibilityRole='header'>
						{post?.title || 'Post Screen'}
					</Text>
				</ThemedView>
				<ThemedView style={styles.categoriesContainer}>
					<Text variant='titleMedium'>{post?.author?.name} |</Text>
					<Text variant='bodyMedium'>
						{post &&
							moment(post?.date_gmt).locale(getLocalDate()).format('D MMMM YY')}
					</Text>
				</ThemedView>
				<ThemedWebView
					uri={post.link + '?app=true'}
					key={slug}
					initialHeight={height - Sizes.HEADER_HEIGHT * 2}
				/>
				<ThemedFooter />
			</ParallaxScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		gap: 8,
	},
	categoriesContainer: {
		flexDirection: 'row',
		gap: 8,
		alignItems: 'center',
		flexWrap: 'wrap',
	},
	headerButtonsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
});
