import { Colors } from '@/constants/Colors';
import React from 'react';
import { DimensionValue, StyleProp, StyleSheet, TextProps, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { isMobileWidth } from '@/app/utils';

type ButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
  type?: 'primary' | 'outline' | 'clear' | 'secondary' | 'white' | 'glow' | 'error';
  text: string;
  width?: DimensionValue;
  fontSize?: number;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: StyleProp<TextProps>
};

const isMobile = isMobileWidth();

const Button: React.FC<ButtonProps> = ({
  onPress,
  disabled = false,
  type = 'primary',
  text = '',
  textColor,
  style,
  width = '100%',
  fontSize = isMobile ? 15 : 20,
  textStyle,
}) => {
  let buttonStyle = styles.primary;
  const [isFocused, setIsFocused] = React.useState(false);

  switch (type) {
    case 'primary':
      buttonStyle = !isFocused ? styles.primary : styles.primaryFocused;
      break;
    case 'outline':
      buttonStyle = !isFocused ? styles.outline : styles.outlineFocused;
      break;
    case 'clear':
      buttonStyle = !isFocused ? styles.clear : styles.clearFocused;
      break;
    case 'secondary':
      buttonStyle = !isFocused ? styles.secondary : styles.secondaryFocused;
      break;
    case 'white':
      buttonStyle = !isFocused ? styles.white : styles.whiteFocused;
      break;
    case 'glow':
      buttonStyle = !isFocused ? styles.glow : styles.glowFocused;
      break;
    case 'error':
      buttonStyle = !isFocused ? styles.error : styles.errorFocused
      break;
  }

  return (
  <TouchableWithoutFeedback
    onPressIn={() => setIsFocused(true)}
    onPressOut={() => setIsFocused(false)}
    onFocus={() => setIsFocused(true)}
    onBlur={() => setIsFocused(false)}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={[{ width }, buttonStyle, style, disabled && styles.disabled]}>
      <ThemedText fontSize={fontSize} color={textColor || buttonStyle.color} style={[
        { textAlign: 'center', lineHeight: fontSize + 3 },
        textStyle
      ]}>{text}</ThemedText>
    </View>
  </TouchableWithoutFeedback>
)};

const styles = StyleSheet.create({
  primary: {
    backgroundColor: Colors.primary,
    color: Colors.textColor,
    borderWidth: 0,
    opacity: 1,
    paddingVertical: 15,
    borderRadius: 6,
  },
  primaryFocused: {
    backgroundColor: '#0056b3',
    color: Colors.textColor,
    borderWidth: 0,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
  },
  clear: {
    backgroundColor: 'transparent',
    color: Colors.textColor,
    borderWidth: 0,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
  },
  clearFocused: {
    backgroundColor: 'transparent',
    color: Colors.primary,
    borderWidth: 0,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: Colors.textColor,
    borderWidth: 1,
    color: Colors.textColor,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
  },
  outlineFocused: {
    backgroundColor: Colors.textColor,
    borderColor: Colors.textColor,
    borderWidth: 1,
    color: Colors.primary,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
  },
  secondary: {
    backgroundColor: Colors.secondary,
    color: Colors.textColor,
    borderWidth: 0,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
  },
  secondaryFocused: {
    backgroundColor: Colors.secondary,
    color: Colors.textColor,
    borderWidth: 0,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
  },
  white: {
    backgroundColor: Colors.textColor,
    color: Colors.darkBlue,
    borderWidth: 0,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
  },
  whiteFocused: {
    backgroundColor: Colors.darkBlue,
    color: Colors.textColor,
    borderWidth: 0,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
  },
  glow: {
    backgroundColor: Colors.textColor,
    color: Colors.darkBlue,
    borderWidth: 0,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
    boxShadow: "1px -1px 10px 7px rgba(102,240,185,0.75);"
  },
  glowFocused: {
    backgroundColor: Colors.textColor,
    color: Colors.darkBlue,
    borderWidth: 0,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
    boxShadow: 'none'
  },
  error: {
    backgroundColor: Colors.darkRed,
    color: Colors.textColor,
    borderWidth: 0,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
    boxShadow: "none"
  },
  errorFocused: {
    backgroundColor: Colors.darkRed,
    color: Colors.textColor,
    borderWidth: 0,
    opacity: 1,
    paddingVertical: 10,
    borderRadius: 6,
    boxShadow: 'none'
  },
  disabled: {
    opacity: 0.65,
  },
});

export default Button;