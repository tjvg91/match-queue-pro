import Button from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import TextInput from "@/components/Input";
import { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated";
import { isMobileWidth } from "@/app/utils";
import { useRouter } from "expo-router";

const isMobile = isMobileWidth();

export default function PlayerGamesScreen() {
  const [mode, setMode] = useState<"default" | "join" | "check in">("default");
  const shadowOpacity = useSharedValue(0.4);
  const router = useRouter();

  const containerRef = useRef(null);

  const animatedStyles = useAnimatedStyle(() => ({
    shadowOpacity: shadowOpacity.value
  }));

  const renderHostAction = () => (
    <>
      <Button
        type="clear"
        text="I'll host instead"
        fontSize={isMobile ? 12 : 16}
        onPress={() => router.push('/pages/host')}
        />
      <Button
        type="clear"
        fontSize={isMobile ? 12 : 16}
        text="Go back home"
        onPress={() => router.back()} />
    </>
  )

  const showEmptyGames = () => (
    <>
      <ThemedText
        type="default"
        fontSize={isMobile ? 32 : 36}
        style={{ marginTop: 60 }}
        color={Colors.label}>
        No active games
      </ThemedText>

      <Button
        type="clear" 
        text="I'll join a group"
        fontSize={isMobile ? 12 : 16}
        textColor={Colors.textColor}
        textStyle={{ marginTop: 15 }}
        onPress={() => setMode("join")}/>
      {renderHostAction()}
    </>
  )

  const showJoinGroup = () => (
    <View style={styles.joinContainer}>
      <FontAwesomeIcon icon="user-group" size={50} color={Colors.textColor} style={{ marginBottom: 20 }}/>
      <TextInput label="Enter group code to join"/>
      <Button text="Join" type="white" style={{ width: '100%', marginTop: 10 }} onPress={() => setMode("check in")} />
    </View>
  )

  const checkInGroup = () => {
    return (
      <>
        <View style={styles.joinContainer}>
          <ThemedText
            type="bold"
            fontSize={isMobile ? 28 : 36}
            style={{ marginTop: isMobile ? 20 : 30, marginBottom: 50 }}>Shuttle Stars</ThemedText>
          <Button text="CHECK IN" type="glow" style={{
            marginTop: 10,
            ...animatedStyles
          }} />
        </View>
        <Button
          type="clear" 
          text="I'll join another group"
          fontSize={isMobile ? 12 : 16}
          textColor={Colors.textColor}
          textStyle={{ marginTop: 15 }}
          onPress={() => setMode("join")}/>
        {renderHostAction()}
      </>
      
    )
  }

  useEffect(() => {
    shadowOpacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }), -1, true
    )
  }, [])

  return (
    <View style={{
      ...styles.emptyContainer,
      transform: isMobile ? "translateY(-35px)" : "translateY(35px)",
    }} ref={containerRef}>
      {mode === "default" && showEmptyGames()}
      {mode === "join" && showJoinGroup()}
      {mode === "check in" && checkInGroup()}
    </View>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.textColor,
    borderWidth: 2,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 380
  }
})