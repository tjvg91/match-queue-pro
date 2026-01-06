import { fetchColorByLevel, isMobileWidth } from '@/app/utils';
import { Colors } from '@/constants/Colors';
import { User } from '@/constants/types';
import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { ThemedText } from './ThemedText';
import Ionicons from '@expo/vector-icons/Ionicons';

type CourtPlayerProps = {
  user: User;
  disabled?: boolean;
  onPress?: (userId: string) => void
};

const isMobile = isMobileWidth();

const CourtPlayer: React.FC<CourtPlayerProps> = ({ user, disabled = false, onPress }) => {
  const colors = fetchColorByLevel(user.level.name);
  return (
    <Pressable
      onPress={() => onPress?.(user.id)}
      style={[
        styles.userContainer,
        {
          backgroundColor: colors.bgColor
        }
      ]}
      key={user.id}
      disabled={disabled}>
      <View style={{ borderRadius: '50%', backgroundColor: colors.fgColor, padding: 5, margin: 2}}>
        <Ionicons name={user.sex === "male" ? "man" : "woman"} color={colors.bgColor} size={16} />
      </View>
      
      <ThemedText color={colors.fgColor} fontSize={isMobile ? 11 : 16} style={styles.textContainer}>{user.username}</ThemedText>
    </Pressable>
  )
};

const styles = StyleSheet.create({
  userContainer: {
    borderRadius: 20,
    backgroundColor: Colors.gradientStopperLight,
    width: isMobile ? 100 : 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  textContainer: {
    paddingVertical: isMobile ? 8 : 10,
    paddingLeft: isMobile ? 3 : 15,
  }
});

export default CourtPlayer;