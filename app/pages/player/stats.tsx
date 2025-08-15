import { ThemedText } from "@/components/ThemedText"
import { Colors } from "@/constants/Colors"
import { StyleSheet, View } from "react-native"

export default function PlayerStatsScreen() {
  const showEmptyStats = () => (
    <>
      <ThemedText type="default" fontSize={36} color={Colors.label}>No stats to show</ThemedText>
      <ThemedText type="default" fontSize={12} color={Colors.label}>(Minimum threshot is 5 games)</ThemedText>
    </>
  )
  return (
    <View style={styles.container}>
      <View>
        <View>
          <ThemedText>9</ThemedText>
          <ThemedText>games played</ThemedText>
          <ThemedText>since registration</ThemedText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})