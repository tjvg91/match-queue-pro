
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Splash from '../assets/images/appicon.png'
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useEffect } from 'react';
import useMQStore from '@/hooks/useStore';
import { useShallow } from 'zustand/shallow';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { isMobileWidth } from './utils';


  const screenWidth = Dimensions.get('screen').width;
  const imageSize = Math.min(screenWidth * 0.4, 200);

export default function App() {
   const { isAuthenticated } = useMQStore(useShallow((state) => ({
      errorMessages: state.errorMessages,
      clearErrorMessages: state.clearErrorMessages,
      isAuthenticated: state.isAuthenticated
    }
  )));
  const navigation = useNavigation();
  const isMobile = isMobileWidth();

  setTimeout(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: !isAuthenticated ? "LogSignIn" : "Home" }]
      })
    );
  }, 2000);


  return (
    <View style={styles.container}>
      <Image source={Splash} style={styles.image} resizeMode="contain" />

      <ThemedText
        color={Colors.textColor2}
        fontSize={isMobile ? 19: 25}
        type="light"
        style={{ letterSpacing: 1 }}
      >Match Queue Pro</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: imageSize,
    height: imageSize,
    marginBottom: 25
  }
});