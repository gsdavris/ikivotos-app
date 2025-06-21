import {
	useContext,
	useState,
	useLayoutEffect,
	useEffect,
	useRef,
} from 'react';
import { FlatList } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import ThemeCard from '@/components/ThemeCard';
import NoPosts from '@/components/NoPosts';
import axios from 'axios';
import { apiUri } from '@/constants/requests';
import { Context } from '@/context';
import { Sizes } from '@/constants/Sizes';
import { useTranslation } from 'react-i18next';

export default function CategoryScreen() {
	const theme = useTheme();
	const { slug, searchQuery } = useLocalSearchParams();
	const { t } = useTranslation();
	const navigation = useNavigation();
	const { state, dispatch } = useContext(Context);

	const category = state?.categories?.find((cat) => cat.slug === slug);

	const [values, setValues] = useState({
		loading: true,
		currentPage: 1,
		search: searchQuery ? encodeURIComponent(searchQuery) : '',
		isLastPage: false,
		fetchedPosts: [],
		error: '',
	});

	const { loading, fetchedPosts, currentPage, isLastPage, search } = values;

	// Avoid multiple API calls when scrolling rapidly
	const isFetchingRef = useRef(false);

	const getPosts = async (page, reset = false) => {
		// Prevent duplicate calls
		if (isFetchingRef.current) return;
		isFetchingRef.current = true;

		setValues((prev) => ({
			...prev,
			error: false,
			loading: true,
			fetchedPosts: reset ? [] : prev.fetchedPosts,
		}));

		try {
			const response = await axios.get(
				`${apiUri}/posts?category=${
					category?.slug || ''
				}&search=${search}&page=${page}&per_page=10`
			);

			const { data } = response;
			const totalPages = parseInt(response.headers['x-total-pages'], 10); // Parse the header value

			// Use Map to remove duplicates
			const updatedPosts = reset
				? data
				: Array.from(
						new Map([...fetchedPosts, ...data].map((p) => [p.id, p])).values()
				  );

			setValues((prev) => ({
				...prev,
				error: false,
				loading: false,
				fetchedPosts: updatedPosts,
				currentPage: page + 1,
				isLastPage: page >= totalPages,
			}));
		} catch (err) {
			setValues((prev) => ({
				...prev,
				error: err?.message,
				loading: false,
			}));

			if (err.message === 'Network Error') {
				dispatch({
					type: 'UPDATE_MESSAGE',
					payload: {
						type: 'error',
						title: t('error'),
						label: t('connection_error'),
					},
				});
			} else {
				dispatch({
					type: 'UPDATE_MESSAGE',
					payload: {
						type: 'error',
						title: 'Error',
						label: err?.message,
					},
				});
			}
		} finally {
			isFetchingRef.current = false;
		}
	};

	useLayoutEffect(() => {
		if (category) {
			navigation.setOptions({ title: category?.name });
		}
		if (searchQuery) {
			navigation.setOptions({ title: t('search') + ': ' + searchQuery });
		}
	}, [navigation, category, searchQuery]);

	useEffect(() => {
		setValues((prev) => ({
			...prev,
			search: searchQuery ? encodeURIComponent(searchQuery) : '',
		}));
	}, [searchQuery, slug]);

	useEffect(() => {
		if (search.trim().length > 0 || slug) {
			getPosts(1, true);
		}
	}, [slug, search]);

	// Handle infinite scrolling safely
	const handleScroll = (event) => {
		const { contentSize, layoutMeasurement, contentOffset } = event.nativeEvent;
		const isCloseToBottom =
			contentSize.height - layoutMeasurement.height - contentOffset.y < 100;

		if (!loading && !isLastPage && isCloseToBottom) {
			getPosts(currentPage, false);
		}
	};

	return (
		<>
			{fetchedPosts.length !== 0 && (
				<FlatList
					showsVerticalScrollIndicator={false}
					style={{ flex: 1 }}
					contentContainerStyle={{
						gap: 16,
						padding: 16,
						paddingBottom: 16 + Sizes.BOTTOM_APPBAR_HEIGHT,
					}}
					data={fetchedPosts}
					renderItem={({ item }) => (
						<ThemeCard
							post={item}
							full
						/>
					)}
					keyExtractor={(item) => item.id.toString()}
					onScroll={handleScroll}
					accessible
					accessibilityLabel={t('post_list')}
				/>
			)}
			{loading && (
				<ActivityIndicator
					size={90}
					style={{
						position: 'absolute',
						bottom: '50%',
						left: '50%',
						transform: [{ translateX: -45 }, { translateY: -45 }],
					}}
					color={theme.colors.primary}
					accessibilityLabel={t('loading')}
				/>
			)}
			{fetchedPosts.length === 0 && !loading && <NoPosts />}
		</>
	);
}
