import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

type ToastMessageProps = {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  showClose?: boolean;
  onClose?: () => void;
};

const ToastMessage: React.FC<ToastMessageProps> = ({ message, type, showClose = true, onClose }) => {
  const styleContainer = {
    ...styles.container,
    backgroundColor: type === 'success' ? Colors.green :
      type === 'error' ? Colors.red :
      type === 'info' ? Colors.gradientStopperLight : 
      type === 'warning' ? Colors.yellow :
      Colors.primary,
    color: type === 'success' ? Colors.textColor :
      type === 'error' ? Colors.darkBlue :
      type === 'info' ? Colors.darkBlue : 
      type === 'warning' ? Colors.darkBlue :
      Colors.textColor,
  };
  return message && (
    <View style={styleContainer}>
      <ThemedText color={styleContainer.color} style={{ flexGrow: 1 }}>{message}</ThemedText>
      {showClose && <FontAwesomeIcon icon="x" size={11} color={styleContainer.color} onPress={onClose} /> }
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    color: Colors.textColor,
    borderRadius: 10,
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 25,
    marginVertical: 20,
    fontSize: 16,
    textAlign: 'left',
    width: '100%',
    opacity: 0.8
  }
});

export default ToastMessage;