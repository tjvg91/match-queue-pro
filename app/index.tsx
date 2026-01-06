import 'react-native-gesture-handler';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Splash from '../assets/images/appicon.png'
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { act, useEffect } from 'react';
import useMQStore from '@/hooks/useStore';
import { useShallow } from 'zustand/shallow';
import { camelizeKeys, isMobileWidth } from './utils';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { Toast } from 'toastify-react-native';


const screenWidth = Dimensions.get('screen').width;
const imageSize = Math.min(screenWidth * 0.4, 200);

export default function App() {
  const { isAuthenticated, supabase, user, activeGroup, setActiveSchedule } = useMQStore(useShallow((state) => ({
    errorMessages: state.errorMessages,
    clearErrorMessages: state.clearErrorMessages,
    isAuthenticated: state.isAuthenticated,
    supabase: state.supabase,
    user: state.user,
    activeGroup: state.activeGroup,
    setActiveSchedule: state.setActiveSchedule
  }
  )));
  const router = useRouter();
  const isMobile = isMobileWidth();

  useEffect(() => {
    let timer = -1;
    if (isAuthenticated && user?.password && user.email) {
      supabase?.auth.getUser().then(async auth => {
        if (!auth.data.user) router.replace('/logSignIn')
        else if(user){
          supabase?.auth.signInWithPassword({
            email: user.email!,
            password: user.password!
          }).then(async () => {
            const curSchedule = await supabase.rpc('get_active_schedules', {
              p_user_id: user.id
            }).single();

            console.log(curSchedule);
            
            if (!!curSchedule.data && !curSchedule.error) {
              setActiveSchedule(camelizeKeys(curSchedule.data?.[0]));

              if(activeGroup?.managedBy === user.id)
                router.replace('/pages/host?isStarted=true');
              else router.replace('/pages/player?isCheckedIn=true');
              return;
            } else {
              router.replace('/pages/home');
            }
          })
            .catch(err => {
              console.log(err);
              Toast.error("Something went wrong. Please check your connection or restart the app.");
            });
        }
      }).catch(() => router.replace('/logSignIn'));
    }
    else {
      timer = setTimeout(() => {
        router.push('/logSignIn');
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
        fontSize={isMobile ? 19 : 25}
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