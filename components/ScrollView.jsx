import { StyleSheet } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

export default function ScrollView({ children, contentContainerStyle }) {
	const scrollRef = useAnimatedRef();
	const bottom = useBottomTabOverflow();

	return (
		<ThemedView style={styles.container}>
			<Animated.ScrollView
				ref={scrollRef}
				scrollEventThrottle={16}
				scrollIndicatorInsets={{ bottom }}
				contentContainerStyle={{ paddingBottom: bottom }}>
				<ThemedView style={[styles.content, contentContainerStyle]}>
					{children}
				</ThemedView>
			</Animated.ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		padding: 16,
		gap: 16,
		overflow: 'hidden',
	},
});
