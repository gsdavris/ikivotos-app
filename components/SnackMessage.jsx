import { useState, useEffect, useContext } from 'react';
import { Snackbar, Text, useTheme } from 'react-native-paper';
import { AccessibilityInfo } from 'react-native';
import { Context } from '@/context';

const SnackMessage = () => {
	const { state } = useContext(Context);
	const { message } = state;
	const theme = useTheme();
	const [visible, setVisible] = useState(false);
	const backgroundColor = () => {
		switch (message?.type) {
			case 'error':
				return '#F44336';
			case 'success':
				return '#4CAF50';
			default:
				return theme.colors.primary;
		}
	};

	useEffect(() => {
		if (message) {
			setVisible(true);

			// Announce to screen readers
			AccessibilityInfo.announceForAccessibility(message?.label);
		}
	}, [message]);

	return (
		<Snackbar
			visible={visible}
			theme={theme}
			onDismiss={() => setVisible(false)}
			duration={10000}
			style={{ backgroundColor: backgroundColor() }}
			action={{
				label: 'Ok',
				onPress: () => {
					setVisible(false);
				},
			}}
			accessibilityLiveRegion='polite' // Makes screen readers announce updates
			accessibilityRole='alert'>
			{message?.title && (
				<Text
					style={{ color: '#fff' }}
					variant='titleMedium'>
					{message?.title}
				</Text>
			)}
			<Text
				style={{ color: '#fff' }}
				variant='bodyMedium'>
				{message?.label}
			</Text>
		</Snackbar>
	);
};

export default SnackMessage;
