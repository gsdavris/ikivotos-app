import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
	const { t } = useTranslation();
	return (
		<>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<ThemedView
				style={styles.container}
				accessibilityLiveRegion='polite'>
				<ThemedText
					type='title'
					accessibilityRole='header'>
					This screen doesn't exist.
				</ThemedText>
				<Link
					href='/'
					style={styles.link}
					accessibilityRole='link'
					accessibilityLabel={t('go-to-home')}>
					<ThemedText type='link'>Go to home screen!</ThemedText>
				</Link>
			</ThemedView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	link: {
		marginTop: 15,
		paddingVertical: 15,
	},
});
