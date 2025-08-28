
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Splash from '../assets/images/appicon.png'
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useEffect } from 'react';
import useMQStore from '@/hooks/useStore';
import { useShallow } from 'zustand/shallow';
import { CommonActions } from '@react-navigation/native';
import { isMobileWidth } from './utils';
import * as Linking from 'expo-linking';
import { useNavigation, useRouter } from 'expo-router';


const screenWidth = Dimensions.get('screen').width;
const imageSize = Math.min(screenWidth * 0.4, 200);

export default function App() {
   const { isAuthenticated, supabase, user } = useMQStore(useShallow((state) => ({
      errorMessages: state.errorMessages,
      clearErrorMessages: state.clearErrorMessages,
      isAuthenticated: state.isAuthenticated,
      supabase: state.supabase,
      user: state.user
    }
  )));
  const router = useRouter();
  const isMobile = isMobileWidth();

  useEffect(() => {
    let timer = -1;
    if(isAuthenticated && user?.password && user.email) {
      supabase?.auth.getUser().then(auth => {
        if(!!auth.data.user) router.replace('/pages/home')
        else {
          supabase?.auth.signInWithPassword({
            email: user.email,
            password: user.password
          }).then(() => router.replace('/pages/home'));
        }
      })

      
    }
    else {
      timer = setTimeout(() => {
        /*navigation.dispatch(
          CommonActions.reset({
            index: 0,
            //routes: [{ name: "LogSignIn" }]
            routes: [{ name: !isAuthenticated ? "LogSignIn" : "Home" }]
          })
        );*/
        router.replace('/pages/home');
      
      }, 2000);
    }
    
    return () => timer !== -1 && clearTimeout(timer)
  }, [isAuthenticated])

    useEffect(() => {
    // When app is opened via a deep link
    const handleDeepLink = (event: Linking.EventType) => {
      const url = event.url;
      console.log("Got URL:", url);

      // Parse the URL for path + query params
      const { path, queryParams } = Linking.parse(url);
      console.log("path:", path, "query:", queryParams);

      // Example: navigate based on path
      if (path === "reset-password") {
        navigation.navigate("LogSignIn", { resetToken: queryParams.token });
      }
      if (path === "verify-email") {
        navigation.navigate("LogSignIn", { hasAccount: true });
      }
    };

    // Subscribe
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Handle initial URL if app was cold-started via link
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) handleDeepLink({ url: initialUrl });
    })();

    return () => subscription.remove();
  }, []);
  
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