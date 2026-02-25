import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useSoundContext } from '../context/SoundContext';

export const MusicToggle: React.FC = () => {
  const { isMusicOn, toggleMusic } = useSoundContext();

  return (
    <TouchableOpacity style={styles.btn} onPress={toggleMusic} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Text style={styles.icon}>{isMusicOn ? '🔊' : '🔇'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 8,
  } as ViewStyle,
  icon: {
    fontSize: 24,
  } as TextStyle,
});
