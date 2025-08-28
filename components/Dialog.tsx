import { Colors } from "@/constants/Colors";
import { Dimensions, DimensionValue, Modal, ModalProps, StyleSheet, View, ViewStyle } from "react-native";
import ButtonIcon from "./ButtonIcon";
import { BlurView } from "expo-blur";

interface Props {
  width?: DimensionValue
  showClose?: boolean,
  style?: ViewStyle
}

const screenDimensions = Dimensions.get('screen');
const dialogWidth = Math.min(screenDimensions.width * 0.8, 480);
const dialogHeight = screenDimensions.height * 0.8;

const Dialog: React.FC<ModalProps & Props> = (props) => {
  const { children, width, showClose, style, ...rest } = props;
  return (
    <Modal
      presentationStyle="overFullScreen"
      animationType="fade"
      backdropColor={Colors.modalBackdrop}
      {...rest}>
      <View style={styles.modalContainer}>
        <BlurView style={StyleSheet.absoluteFill} intensity={10} tint="dark" />
        <View style={[styles.modal, showClose && { paddingTop: 45, paddingBottom: 35 },  style]}>
          {
            showClose && (
              <ButtonIcon
                style={{ position: 'absolute', top: 0, right: -5, width: "auto", paddingVertical: 10, paddingHorizontal: 0, margin: 0, zIndex: 20 }}
                type="clear"
                fontSize={15}
                textColor={Colors.darkBlue}
                onPress={props.onRequestClose}
                icon="x">
                
              </ButtonIcon>
            )
          }
          <BlurView style={StyleSheet.absoluteFill} intensity={80} tint="light" />
          {children}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10
  },
  modal: {
    position: 'absolute',
    left: screenDimensions.width / 2,
    top: screenDimensions.height / 2,
    backgroundColor: "#ffffffaa",
    width: dialogWidth,
    maxHeight: dialogHeight,
    padding: 30,
    borderRadius: 10,
    transform: 'translate(-50%, -50%)',
    overflow: 'hidden'
  }
})

export default Dialog;