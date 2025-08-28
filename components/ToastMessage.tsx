import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { ToastType } from '@/constants/types';

type ToastMessageProps = {
  message: string;
  type: ToastType;
  showClose: true;
  onClose: () => void;
} | {
  message: string;
  type: ToastType;
  showClose: false;
  onClose?: never
};

const ToastMessage: React.FC<ToastMessageProps> = ({ message, type, showClose = true, onClose }) => {
  const [isVisible, setIsVisible] = useState(!!message);
  const styleContainer = {
    ...styles.container,
    backgroundColor: type === 'success' ? Colors.green :
      type === 'error' ? Colors.darkRed :
      type === 'info' ? Colors.gradientStopperLight : 
      type === 'warning' ? Colors.yellow :
      Colors.primary,
    color: type === 'success' ? Colors.textColor :
      type === 'error' ? Colors.textColor :
      type === 'info' ? Colors.darkBlue : 
      type === 'warning' ? Colors.darkBlue :
      Colors.textColor,
  };

  useEffect(() => {
    setIsVisible(!!message);
  }, [message])

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer)
  }, [isVisible])
  

  return isVisible && (
    <View style={styleContainer}>
      <ThemedText color={styleContainer.color} style={{ flexGrow: 1, lineHeight: 19 }}>{message}</ThemedText>
      {showClose && (<Pressable onPress={() => onClose?.()}>
        <FontAwesomeIcon icon="x" size={11} color={styleContainer.color} />
      </Pressable>) }
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
    opacity: 0.8,
  }
});

export default ToastMessage;