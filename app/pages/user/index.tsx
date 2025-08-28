import { View, StyleSheet } from 'react-native';
import { PlayerDetails } from '../../../components/PlayerDetails';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import useMQStore from '@/hooks/useStore';
import { User } from '@/constants/types';
import { camelizeKeys } from '@/app/utils';
import { useRouter } from 'expo-router';
import { Toast } from 'toastify-react-native';
import Button from '@/components/Button';

export default function UserProfileScreen() {
  const { setIsLoading, supabase, user } = useMQStore(useShallow(s => ({
    setIsLoading: s.setLoading,
    supabase: s.supabase,
    user: s.user
  })))
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);

    console.log('userId', user?.id);
    const getUserInfo = async () => {
      const { data } = await supabase?.from('user').select('*, user_level(level(*))').eq('id', user?.id).single();
      const tempReturn = camelizeKeys(data);
      tempReturn.level = tempReturn['userLevel'].flatMap((ul: any) => ul.level)?.[0] || null;
      delete tempReturn['userLevel'];
      setUserInfo(tempReturn);
    }

    getUserInfo();
  }, [])

  return (
    <View style={styles.container}>
      <PlayerDetails
        userId={userInfo?.id}
        existingUser={userInfo}
        onSuccess={() => {
          router.back();
          Toast.success('User updated successfully.')
        }}
        isFull/>
      <Button
        type="outline"
        text="Cancel"
        style={{ marginTop: 10 }}
        onPress={() => router.back()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});