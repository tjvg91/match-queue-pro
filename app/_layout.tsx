import { ParamListBase, RouteProp, ThemeProvider, useNavigation, } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';

import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import useMQStore from '@/hooks/useStore';
import { useShallow } from 'zustand/shallow';
import ToastMessage from '@/components/ToastMessage';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { ThemedText } from '@/components/ThemedText';
import { PortalHost } from '@rn-primitives/portal';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faRefresh } from '@fortawesome/free-solid-svg-icons/faRefresh';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons/faClockRotateLeft';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons/faUserGroup';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faX } from '@fortawesome/free-solid-svg-icons/faX';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare'
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightFromBracket'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle'
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Dialog from '@/components/Dialog';
import { useCallback, useState } from 'react';
import { createClient, processLock } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_AUTH_KEY, SUPABASE_URL } from '@/constants/values';
import ButtonIcon from '@/components/ButtonIcon';
import SwipeButton from 'rn-swipe-button';
import Hr from '@/components/ui/hr';
import { Stack, useRouter } from 'expo-router';
import ToastManager from 'toastify-react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { DropProvider } from "react-native-reanimated-dnd";


library.add(
  faRefresh, faClockRotateLeft, faCaretRight, faCaretDown, faUserGroup, faPlusCircle, faChevronRight, faX,
  faChevronUp, faChevronDown, faCheck, faUser, faCheckSquare, faSquare, faChartLine, faArrowRightFromBracket,
  faUsers, faInfoCircle, faPlay
)

const supabase = createClient(SUPABASE_URL || "", SUPABASE_AUTH_KEY || "", {
  auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  }
});

if (Platform.OS !== "web") {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
}

export default function RootLayout() {

  const [loaded] = useFonts({
    SourceSans: require('../assets/fonts/source-sans-pro/source-sans-pro.regular.ttf'),
    SourceSansLight: require('../assets/fonts/source-sans-pro/source-sans-pro.light.ttf'),
    SourceSansExtraLight: require('../assets/fonts/source-sans-pro/source-sans-pro.extralight.ttf'),
    SourceSansBold: require('../assets/fonts/source-sans-pro/source-sans-pro.bold.ttf'),
    SourceSansSemiBold: require('../assets/fonts/source-sans-pro/source-sans-pro.semibold.ttf'),
    SourceExtraBold: require('../assets/fonts/source-sans-pro/source-sans-pro.black.ttf'),
    SourceSansExtraLightItalic: require('../assets/fonts/source-sans-pro/source-sans-pro.semibold-italic.ttf'),
  });

  const { user, setUser, errorMessages, clearErrorMessages, setSupabase, setIsAuthenticated } = useMQStore(useShallow((state) => ({
    user: state.user,
    setUser: state.setUser,
    errorMessages: state.errorMessages,
    clearErrorMessages: state.clearErrorMessages,
    setSupabase: state.setSupabase,
    setIsAuthenticated: state.setIsAuthenticated,
  }
  )));

  const [isUserDialogShown, showUserDialog] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();

  const renderUserDialog = useCallback(() => (
    <Dialog
      showClose
      visible={isUserDialogShown}
      style={{ paddingLeft: 10, marginRight: -10 }}
      onRequestClose={() => showUserDialog(false)} width={'70%'}>
      <ButtonIcon
        text="Profile"
        icon={"user"}
        type="secondary"
        fontSize={16}
        style={{ justifyContent: 'center' }}
        onPress={() => {
          router.push('/pages/user');
          showUserDialog(false);
        }}
      />
      <ButtonIcon
        text="Stats"
        icon={"chart-line"}
        type="secondary"
        style={{ justifyContent: 'center' }}
        fontSize={16}
        onPress={() => {
          router.push('/pages/user/stats');
          showUserDialog(false);
        }} />
      <ButtonIcon
        text="Groups"
        icon={"users"}
        type="secondary"
        style={{ justifyContent: 'center' }}
        fontSize={16}
        onPress={() => {
          router.push('/pages/user/groups');
          showUserDialog(false);
        }} />
      <Hr color={Colors.darkGray} style={{ marginVertical: 30, width: '100%', marginLeft: '2.5%' }} />
      <SwipeButton
        finishRemainingSwipeAnimationDuration={500}
        railBackgroundColor={Colors.darkRed}
        railFillBackgroundColor={Colors.red}
        railFillBorderColor={'transparent'}
        railBorderColor={'transparent'}
        thumbIconComponent={() => <FontAwesomeIcon icon="arrow-right-from-bracket" color={Colors.darkRed} />}
        thumbIconBackgroundColor={Colors.textColor}
        thumbIconBorderColor={'transparent'}
        titleColor={Colors.textColor}
        titleStyles={{ letterSpacing: 1.1, fontFamily: "SourceSans" }}
        title="Sign Out"
        width={'100%'}
        onSwipeSuccess={() => { setIsAuthenticated(false); setUser?.(undefined); showUserDialog(false); }} />
    </Dialog>
  ), [navigation, isUserDialogShown]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  setSupabase(supabase);

  const theme: ReactNavigation.Theme = {
    colors: {
      primary: Colors.primary,
      background: 'rgba(62, 55, 55, 0)', // Transparent background to match DarkTheme
      card: Colors.secondary,
      text: Colors.textColor,
      border: Colors.darkBlue,
      notification: Colors.green,
    },
    fonts: {
      regular: { fontFamily: 'SourceSans', fontWeight: 'normal' },
      medium: { fontFamily: 'SourceSansSemiBold', fontWeight: '500' },
      bold: { fontFamily: 'SourceSansBold', fontWeight: 'bold' },
      heavy: { fontFamily: 'SourceExtraBold', fontWeight: '800' },
    },
    dark: true
  }
  const headerRightRegex = /logSignIn|home|index/i;

  const headerOptions = (user: any, showUserDialog: (v: boolean) => void, route: RouteProp<ParamListBase, string>) => ({
    headerRight: () => !headerRightRegex.test(route.name) && (
      <View style={styles.header}>
        <ThemedText
          type="bold"
          color={Colors.textColor}
          fontSize={20}
          style={{ width: "auto", marginRight: 10, transform: "translateY(2px)" }}
        >
          {user?.username}
        </ThemedText>
        <Pressable onPress={() => {
          showUserDialog(true);
        }}>
          <FontAwesomeIcon icon="user" size={20} color={Colors.textColor} />
        </Pressable>
      </View>
    ),
    headerTitle: "",
    headerShown: !/host/.test(route.name),
    headerLeft: () => !headerRightRegex.test(route.name) && router.canGoBack() && (
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color={Colors.textColor} />
      </Pressable>
    ),
    headerBackground: () => <View style={{ flex: 1, backgroundColor: "transparent" }} />
  })

  const renderScreens = () => {
    return (
      <>
        <Stack.Screen name="index" />

        <Stack.Screen name="./pages/user" />
        <Stack.Screen name="./logSignIn" />
        <Stack.Screen name="./pages/home" />
        <Stack.Screen name="./pages/user/groups" />
        <Stack.Screen name="./pages/user/stats" />
        <Stack.Screen name="./pages/host" />

        <Stack.Screen name="./+not-found" />
      </>
    )
  }

  return (
    <GestureHandlerRootView>
      <DropProvider>
        <ThemeProvider value={theme}>
          <SafeAreaProvider>
            <LinearGradient
              colors={[Colors.green, Colors.gradientStopper, Colors.primary]}
              locations={[0, 0.34, 1]}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={[StyleSheet.absoluteFill, { paddingTop: 0 }]}>
              {!!errorMessages?.length && (
                <ToastMessage message={errorMessages?.join("\n")} type="error" showClose onClose={() => clearErrorMessages?.()} />
              )}
              <Stack screenOptions={({ route }) => ({
                ...headerOptions(user, showUserDialog, route),
              })}>

                {renderScreens()}
              </Stack>
              {renderUserDialog()}
              <StatusBar style="auto" />
            </LinearGradient>
          </SafeAreaProvider>
          <PortalHost />
          <ToastManager showProgressBar={false} theme="dark" textStyle={{ fontFamily: 'SourceSans' }} position={'bottom'} />
        </ThemeProvider>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
    padding: 10,
    //...styles.header,
    //marginTop: props..name === "Player" ? 55: Constants.statusBarHeight - 10,
  },
  userDialogItem: {
    flexDirection: 'row',
    columnGap: 10,
    paddingHorizontal: 5,
    paddingVertical: 10
  }
})