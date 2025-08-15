import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, ViewProps } from 'react-native';

type HrProps = ViewProps & {
  color?: string;
  thickness?: number;
};

const Hr: React.FC<HrProps> = ({
  color = Colors.label,
  thickness = 1,
  style,
  ...rest
}) => (
  <View style={[{ width: '100%', height: thickness, backgroundColor: color }, style]} {...rest} />
);

export default Hr;