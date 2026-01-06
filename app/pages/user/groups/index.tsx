import { camelizeKeys } from '@/app/utils';
import TextInput from '@/components/Input';
import { ThemedText } from '@/components/ThemedText';
import { Group } from '@/constants/types';
import useMQStore from '@/hooks/useStore';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useShallow } from 'zustand/shallow';

const UserGroups: React.FC = () => {
  const { supabase, user } = useMQStore(useShallow(s => ({
    supabase: s.supabase,
    user: s.user
  })));
  const [groupList, setGroupList] = useState<Group[]>([]);

  useEffect(() => {
    const getGroups = async () => {
      const groups = await supabase?.from('user').select(`id, user_group (group (*))`).eq('id', user?.id).single();
      if(!groups?.error) {
        setGroupList(groups?.data.user_group.map(ug => camelizeKeys(ug.group)) || [])
      }
    }
    getGroups();
  }, [])

  return (
    <View style={styles.container}>
      <TextInput label="Search groups"/>
      <FlatList
        data={groupList}
        renderItem={(data) => (<ThemedText>{data.item.name}</ThemedText>)} />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 30
  },
});

export default UserGroups;