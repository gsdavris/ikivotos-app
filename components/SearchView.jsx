import { useState } from 'react';
import { StyleSheet, View, Dimensions, AccessibilityInfo } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const { height } = Dimensions.get('screen');

const SearchView = ({ onClose }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const router = useRouter();
	const navigation = useNavigation();
	const { t } = useTranslation();

	const isSearchDisabled = searchQuery.trim().length < 3;

	const handleSearch = () => {
		if (!isSearchDisabled) {
			navigation.navigate({
				name: 'category/[slug]',
				params: {
					searchQuery: searchQuery.trim(),
					slug: '',
				},
			});
			onClose(); // Close modal after navigating
			AccessibilityInfo.announceForAccessibility(t('searching'));
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				mode='outlined'
				label={t('search-posts')}
				value={searchQuery}
				onChangeText={setSearchQuery}
				style={styles.input}
				accessibilityLabel={t('search_key')}
				accessibilityHint={t('enter_keyword_search')}
				left={
					<TextInput.Icon
						icon='magnify'
						style={{ minHeight: 48, minWidth: 48 }}
						accessible={true}
						accessibilityLabel={t('search_icon')}
					/>
				}
				right={
					searchQuery?.length > 0 ? (
						<TextInput.Icon
							icon='close'
							onPress={() => {
								setSearchQuery('');
								AccessibilityInfo.announceForAccessibility(t('search_cleared'));
							}}
							accessibilityLabel={t('clear_search')}
						/>
					) : null
				}
			/>
			<Button
				mode='contained-tonal'
				onPress={handleSearch}
				style={styles.button}
				labelStyle={{ fontSize: 16, lineHeight: 36 }}
				disabled={isSearchDisabled}
				accessibilityState={{ disabled: isSearchDisabled }}
				accessibilityHint={t('tap_button_search')}>
				{t('search')}
			</Button>
		</View>
	);
};

export default SearchView;

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		borderRadius: 10,
		alignItems: 'center',
		gap: 16,
	},
	input: {
		width: '100%',
		minHeight: 48,
	},
	button: {
		width: '100%',
		borderRadius: 32,
	},
});
