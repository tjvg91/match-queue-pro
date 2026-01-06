import { JSX, PropsWithChildren } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Collapsible } from 'react-native-fast-collapsible';

type Props = {
  title: string
  style?: ViewStyle
  isVisible: boolean,
  headerRight?: JSX.Element
  setVisible: (visible: boolean) => void
}

export function MQCollapsible({ children, title, isVisible, headerRight, setVisible }: Props & PropsWithChildren ) {

  return (
    <View style={{ width: '100%', flexDirection: 'column', flex: 1, flexGrow: 1, marginTop: 15, marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5, marginTop: -7.5 }}
          onPress={() => setVisible(!isVisible)}>
          <FontAwesomeIcon
            icon={!isVisible ? "caret-right" : "caret-down"}
            size={15}
            style={{ marginTop: -5 }}
            color={Colors.gradientStopperLight} />
          <ThemedText fontSize={14}>{title}</ThemedText>
        </TouchableOpacity>
        {headerRight}
      </View>

      <Collapsible isVisible={isVisible}>{children}</Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
