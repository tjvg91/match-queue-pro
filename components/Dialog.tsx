import { Colors } from "@/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Dimensions, DimensionValue, Modal, ModalProps, Pressable, StyleSheet, View } from "react-native";

interface Props {
  width?: DimensionValue
  showClose?: boolean
}

const screenDimensions = Dimensions.get('screen');

const Dialog: React.FC<ModalProps & Props> = (props) => {
  const { children, width, showClose, ...rest } = props;
  return (
    <Modal
      presentationStyle="overFullScreen"
      animationType="fade"
      backdropColor={Colors.modalBackdrop}
      {...rest}>
      <View style={styles.modalContainer}>
        <View style={[styles.modal, { width }]}>
          {
            showClose && (
              <Pressable
                style={{ position: 'absolute', top: 12.5, right: 12.5 }}
                onPress={(e) => props.onRequestClose?.(e)}>
                <FontAwesomeIcon icon="x" size={12} />
              </Pressable>
            )
          }


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
    backgroundColor: 'transparent'
  },
  modal: {
    position: 'absolute',
    left: screenDimensions.width / 2,
    top: screenDimensions.height / 2,
    backgroundColor: Colors.textColor,
    width: Math.min(screenDimensions.width * 0.9, 480),
    maxHeight: screenDimensions.height * 0.8,
    padding: 20,
    borderRadius: 10,
    transform: 'translate(-50%, -50%)',
  }
})

export default Dialog;