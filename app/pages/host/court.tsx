import { isMobileWidth } from "@/app/utils";
import CourtComponent from "@/components/Court";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Court } from "@/constants/types";
import { StyleSheet, View } from "react-native";

interface Props {
  courts?: Court[],
  onAddCourt?: () => void
}

const isMobile = isMobileWidth();

export default function HostCourt({
  courts,
  onAddCourt
}: Props) {
  return (
    <View style={styles.court}>
      <ThemedText color={Colors.gradientStopperLight} style={{ marginBottom: -20 }}>Now Playing</ThemedText>
      {
        courts?.map(court => (
          <CourtComponent key={court.id} width={'100%'} court={court} />
        ))
      }
      <CourtComponent width={'100%'} mode="PLACEHOLDER" onAddCourt={() => onAddCourt?.()}/>
    </View>
  )
}

const styles = StyleSheet.create({
  court: {
    flex: 1,
    width: isMobile ? '100%' : '50%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingRight: isMobile ? 0 : 15,
    gap: 25,
    borderRightColor: Colors.label,
    borderRightWidth: isMobile ? 0 : 1,
    borderStyle: 'solid'
  }
})