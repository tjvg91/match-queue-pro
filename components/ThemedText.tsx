import { StyleProp, StyleSheet, Text, TextStyle, type TextProps } from 'react-native';
import { Colors } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
  color?: string
  type?: 'default' | 'title' | 'semiBold' | 'bold' | 'light' | 'extraLight' | 'subtitle' | 'link';
  fontSize?: number
  style?: StyleProp<TextStyle>
};

export function ThemedText({
  style,
  color = Colors.textColor,
  fontSize = 16,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        { color, fontSize, lineHeight: fontSize },
        type === 'default' ? styles.default : undefined,
        type === 'extraLight' ? styles.defaultExtraLight : undefined,
        type === 'light' ? styles.defaultLight : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'bold' ? styles.defaultBold : undefined,
        type === 'semiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  defaultExtraLight: {
    fontFamily: 'SourceSansExtraLight',
  },
  defaultLight: {
    fontFamily: 'SourceSansLight',
  },
  default: {
    fontFamily: 'SourceSans',
  },
  defaultSemiBold: {
    fontFamily: 'SourceSansSemiBold',
  },
  defaultBold: {
    fontFamily: 'SourceSansBold',
  },
  title: {
    fontSize: 32,
    fontFamily: 'SourceSansBold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'SourceSansBold',
  },
  link: {
    fontFamily: 'SourceSans',
  },
});
