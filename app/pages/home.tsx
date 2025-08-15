import PlayerSVG from "@/components/svg/Player";
import QueueMasterSVG from "@/components/svg/QueueMaster";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Dimensions, Pressable, StyleSheet, TouchableHighlight, View, ViewStyle } from "react-native";

export default function HomeScreen() {
  const { width } = Dimensions.get('screen');
  const navigation = useNavigation();

  return (
    <View style={[styles.container as ViewStyle, { flexDirection: width < 768 ? "column" : "row", }]}>
      <Pressable
        onPress={() => navigation.navigate('Host')}>
          <View style={[styles.button as ViewStyle, { backgroundColor: Colors.green }]}>
            <QueueMasterSVG />
            <ThemedText fontSize={18}>Host a game</ThemedText>
          </View>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('Player')}>
          <View style={[styles.button as ViewStyle, { backgroundColor: Colors.darkBlue }]}>
            <PlayerSVG />
            <ThemedText fontSize={18}>I wanna play</ThemedText>
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
  }
})