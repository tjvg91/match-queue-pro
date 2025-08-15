import React, { useState } from 'react';
import { FlatList, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';

type CheckboxListProps = {
  data: { id: string; label: string }[];
  initialCheckedIds?: string[];
  onChange?: (checkedIds: string[]) => void;
};

const CheckboxList: React.FC<CheckboxListProps> = ({
  data,
  initialCheckedIds = [],
  onChange,
}) => {
  const [checkedIds, setCheckedIds] = useState<string[]>(initialCheckedIds);

  const toggleCheck = (id: string) => {
    let newCheckedIds: string[];
    if (checkedIds.includes(id)) {
      newCheckedIds = checkedIds.filter((checkedId) => checkedId !== id);
    } else {
      newCheckedIds = [...checkedIds, id];
    }
    setCheckedIds(newCheckedIds);
    onChange?.(newCheckedIds);
  };

  const renderItem = ({ item }: { item: { id: string; label: string } }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => toggleCheck(item.id)}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <ThemedText color={Colors.darkBlue} fontSize={20} style={{ marginBottom: -12.5 }}>{item.label}</ThemedText>
        {checkedIds.includes(item.id) ? 
          <FontAwesomeIcon size={25} color={Colors.darkBlue} icon="square-check" /> : 
          <FontAwesomeIcon size={25} color={Colors.darkBlue} icon={["far", "square"]} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      extraData={checkedIds}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
  },
});

export default CheckboxList;