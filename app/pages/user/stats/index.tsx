import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const UserStats: React.FC = () => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>User Stats</ThemedText>
      {/* Add your stats components here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default UserStats;