import { StyleSheet } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

const SearchModal = ({ children, visible, onDismiss }) => {
	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={onDismiss}
				contentContainerStyle={styles.containerStyle}
				accessibilityLabel='Dialog'
				accessibilityLiveRegion='polite'
				accessibilityHint='Contains important information'
				accessibilityViewIsModal>
				{children}
			</Modal>
		</Portal>
	);
};

export default SearchModal;

const styles = StyleSheet.create({
	containerStyle: {
		backgroundColor: 'white',
		padding: 20,
		margin: 24,
		borderRadius: 5,
	},
});
