import { Colors } from '@/constants/Colors';
import React from 'react';
import { ThemedText } from './ThemedText';
import { StyleSheet, View } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { Props } from 'react-native-floating-label-input/src';


type TextInputProps = Props & {
	error?: string;
	darkMode?: boolean;
};

const TextInput: React.FC<TextInputProps> = ({ label, error, value, darkMode = true, ...props }) => {
	const { editable } = props;

	return (
		<View style={styles.container}>
			<FloatingLabelInput
				value={value}
				onChangeText={(text) => props.onChangeText?.(text)}
				label={label || ''}
				isPassword={props.isPassword}
				placeholderTextColor={Colors.label}
				inputStyles={{ ...styles.input, color: !editable ? Colors.label : darkMode ? Colors.textColor : Colors.darkBlue }}
				customLabelStyles={{
					colorBlurred: darkMode ? Colors.label : Colors.darkBlue,
					colorFocused: !editable ? Colors.label : error ? Colors.red : darkMode ? Colors.textColor : Colors.darkBlue,
					leftFocused: 0,
				}}
				containerStyles={{
					...styles.inputContainer,
					borderBottomColor: !editable ? Colors.label : error ? Colors.red : darkMode ? Colors.label : Colors.darkBlue
				}}
				{...props}
				 />
			{error && <ThemedText style={{ color: Colors.red, fontSize: 12, marginTop:0 }}>{error}</ThemedText>}
		</View>
	)
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginBlock: 10,
	},
	inputContainer: {
		borderBottomColor: Colors.label,
		borderBottomWidth: 1,
	},
	input: {
		flex: 1,
		backgroundColor: 'transparent',
		width: '100%',
		fontSize: 18, 
		color: Colors.textColor,
		fontWeight: 300,
		outlineWidth: 0,
		paddingTop: 17,
		paddingBottom: 2,
	},
});

export default TextInput;