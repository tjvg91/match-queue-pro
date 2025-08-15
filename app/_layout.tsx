import { ThemeProvider, } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';

import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import useMQStore from '@/hooks/useStore';
import { useShallow } from 'zustand/shallow';
import ToastMessage from '@/components/ToastMessage';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import HomeScreen from './pages/home';
import NotFoundScreen from './+not-found';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser'
import { ThemedText } from '@/components/ThemedText';
import PlayerHomeScreen from './pages/player';
import HostHomeScreen from './pages/host';
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
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightFromBracket'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';
import App from './index';
import LogSignScreen from './logSignIn';
import { isMobileWidth } from './utils';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Dialog from '@/components/Dialog';
import { useState } from 'react';
import { createClient, processLock } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage';


library.add(
  faRefresh, faClockRotateLeft, faCaretRight, faCaretDown,faUserGroup, faPlusCircle, faChevronRight, faX,
  faChevronUp, faChevronDown, faCheck, faUser, faCheckSquare, faSquare, faChartLine, faArrowRightFromBracket
)

const isMobile = isMobileWidth();

const supabaseUrl = "https://lpsmxtnixtzgovqsigxs.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwc214dG5peHR6Z292cXNpZ3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzYzNzAsImV4cCI6MjA3MDg1MjM3MH0.N7aeeH5mIkYQfp56doBNNiHTkPfN9XBZ1TRcGeyxbOQ" 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
  });

  const { user, errorMessages, clearErrorMessages } = useMQStore(useShallow((state) => ({
      user: state.user,
      errorMessages: state.errorMessages,
      clearErrorMessages: state.clearErrorMessages,
    }
  )));

  const [isUserDialogShown, showUserDialog] = useState(false);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

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

  const Stack = createNativeStackNavigator();

  const headerOptions: NativeStackNavigationOptions = {
    headerRight: () => (
      <View style={styles.header}>
        <ThemedText
          type="bold"
          color={Colors.textColor}
          fontSize={20}
          style={{ width: "auto", marginRight: 20 }}
        >
          {user?.username}
        </ThemedText>
        <Pressable onPress={() => showUserDialog(true)}>
          <FontAwesomeIcon icon="user" size={20} color={Colors.textColor}/>
        </Pressable>
      </View>
    ),
    headerTitle: "",
    headerBackground: () => 'transparent'    
  }

  const renderScreens = () => {
    return (
      <>
        <Stack.Screen name="Index" component={App} options={{ headerShown: false }}/>
        <Stack.Screen name="LogSignIn" component={LogSignScreen} options={{ headerShown: false, animation: "fade" }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{...headerOptions, animation: "fade"}}/>
        <Stack.Screen name="NotFound" component={NotFoundScreen} options={headerOptions}/>
        <Stack.Screen name="Player" component={PlayerHomeScreen} options={headerOptions}/>
        <Stack.Screen name="Host" component={HostHomeScreen} options={{ headerShown: false }} />

      </>
    )
  }

  const renderUserDialog = () => (
    <Dialog
      showClose
      visible={isUserDialogShown}
      onRequestClose={() => showUserDialog(false)} width={'70%'}>
      <Pressable style={styles.userDialogItem}>
        <FontAwesomeIcon icon="user" color={Colors.darkBlue}/>
        <ThemedText color={Colors.darkBlue}>Profile</ThemedText>
      </Pressable>
      <Pressable style={styles.userDialogItem}>
        <FontAwesomeIcon icon="chart-line" color={Colors.darkBlue}/>
        <ThemedText color={Colors.darkBlue}>Show Stats</ThemedText>
      </Pressable>
      <Pressable style={styles.userDialogItem}>
        <FontAwesomeIcon icon="arrow-right-from-bracket" color={Colors.darkRed}/>
        <ThemedText color={Colors.darkRed}>Sign Out</ThemedText>
      </Pressable>
    </Dialog>
  )

  return (        
    <GestureHandlerRootView>
      <ThemeProvider value={theme}>
        <SafeAreaProvider>
          <LinearGradient
            colors={[Colors.green, Colors.gradientStopper, Colors.primary]}
            locations={[0, 0.34, 1]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={[StyleSheet.absoluteFill, { paddingTop: 0 }]}>
            {!!errorMessages?.length && (
              <ToastMessage message={errorMessages?.join("\n")} type="error" onClose={() => clearErrorMessages?.()} />
            )}
            {renderUserDialog()}
            <Stack.Navigator initialRouteName="Index" screenOptions={{ animation: "none" }}>
              {renderScreens()}
            </Stack.Navigator>
            <StatusBar style="auto" />
          </LinearGradient>
        </SafeAreaProvider>
        <PortalHost />
      </ThemeProvider>
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