import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface NumberButtonProps {
  number: number;
  flash: 'correct' | 'wrong' | null;
  onPress: (num: number) => void;
  disabled?: boolean;
}

const COLORS = {
  surface: '#1E2D3D',
  primary: '#1A56A0',
  success: '#44BB44',
  error: '#FF4444',
  textPrimary: '#FFFFFF',
};

export const NumberButton: React.FC<NumberButtonProps> = ({
  number,
  flash,
  onPress,
  disabled,
}) => {
  const bgColor =
    flash === 'correct'
      ? COLORS.success
      : flash === 'wrong'
      ? COLORS.error
      : COLORS.surface;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }]}
      onPress={() => onPress(number)}
      disabled={disabled}
      activeOpacity={0.7}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
    >
      <Text style={styles.text}>{number}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderWidth: 1,
    borderColor: '#2E75B6',
  } as ViewStyle,
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'monospace' as any,
    fontWeight: 'bold',
  },
});
