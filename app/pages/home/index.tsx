import PlayerSVG from '@/components/svg/Player';
import QueueMasterSVG from '@/components/svg/QueueMaster';
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View, ViewStyle } from "react-native";

export default function HomeScreen() {
  const { width } = Dimensions.get('screen');
  const [hostIn, setHostIn] = useState(false);
  const [playerIn, setPlayerIn] = useState(false);
  const router = useRouter();

  return (  
    <View style={[styles.container as ViewStyle, { flexDirection: width < 768 ? "column" : "row", }]}>
      <Pressable
        onPressIn={() => setHostIn(true)}
        onPressOut={() => setHostIn(false)}
        onPress={() => router.push('/pages/host')}>
          <View style={styles.button as ViewStyle}>
            <BlurView style={StyleSheet.absoluteFill} intensity={40} tint={hostIn ? "dark" : "light"} />
            <QueueMasterSVG foregroundColor={Colors.primary} foregroundOpacity={0.3}/>
            <ThemedText fontSize={25} color={Colors.textColor} style={{ letterSpacing: 1.1, marginTop: 5 }}>Host a game</ThemedText>
          </View>
      </Pressable>
      <Pressable
        onPressIn={() => setPlayerIn(true)}
        onPressOut={() => setPlayerIn(false)}
        onPress={() => router.push('/pages/player')}>
          <View style={styles.button as ViewStyle}>
            <BlurView style={StyleSheet.absoluteFill} intensity={40} tint={playerIn ? "dark" : "light"} />
            <PlayerSVG foregroundColor={Colors.secondary} foregroundOpacity={0.3}/>
            <ThemedText fontSize={25} color={Colors.textColor} style={{ letterSpacing: 1.1, marginTop: 5 }}>I wanna play</ThemedText>
            
          </View>
      </Pressable>
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    height: "100%",
    marginTop: -40
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    height: "fit-content",
    borderRadius: 10,
    rowGap: 10,
    padding: 30,
    backgroundColor: "#ffffff11",
    //borderWidth: 1,
    borderColor: "#ffffff33",
    overflow: 'hidden',
    //boxShadow: "0px 0px 14px 5px rgba(0, 0, 0, 0.1)"
  }
})