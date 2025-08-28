import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { Option } from '@/constants/types';


type RadioSwitchProps = {
  options: Option[];
  value: string
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
};

const RadioSwitch: React.FC<RadioSwitchProps> = ({
  options,
  onChange,
  value,
  error,
  disabled = false,
}) => {
  return (
    <>
      <View style={styles.container}>
        {options.map((opt, idx) => (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            disabled={disabled}
            style={[styles.option, {
              backgroundColor: opt.value === value ? Colors.textColor : undefined,
              borderLeftWidth: idx > 0 ? 1 : 0
            }]}>
            <ThemedText fontSize={12} color={opt.value === value ? Colors.darkGreen : Colors.textColor}>{opt.label}</ThemedText>
          </Pressable>
        ))}
      </View>
      {error && <ThemedText style={{ color: Colors.red, fontSize: 12, marginTop: -4}}>{error}</ThemedText>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.textColor,
    marginVertical: 10
  },
  option: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 10,
    borderColor: Colors.textColor
  }
});

export default RadioSwitch;