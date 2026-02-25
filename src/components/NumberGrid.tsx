import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { NumberButton } from './NumberButton';
import { ButtonFlash } from '../hooks/useGameLogic';

interface NumberGridProps {
  gridPositions: number[]; // 30 items, 0 = empty
  flash: ButtonFlash | null;
  onPress: (num: number) => void;
  disabled?: boolean;
}

const COLS = 5;

export const NumberGrid: React.FC<NumberGridProps> = ({
  gridPositions,
  flash,
  onPress,
  disabled,
}) => {
  const rows: number[][] = [];
  for (let r = 0; r < 6; r++) {
    rows.push(gridPositions.slice(r * COLS, r * COLS + COLS));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rIdx) => (
        <View key={rIdx} style={styles.row}>
          {row.map((num, cIdx) => {
            const key = `${rIdx}-${cIdx}`;
            if (num === 0) {
              return <View key={key} style={styles.emptySlot} />;
            }
            const flashType =
              flash && flash.number === num ? flash.type : null;
            return (
              <NumberButton
                key={key}
                number={num}
                flash={flashType}
                onPress={onPress}
                disabled={disabled}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    alignItems: 'center',
  } as ViewStyle,
  row: {
    flexDirection: 'row',
  } as ViewStyle,
  emptySlot: {
    width: 56,
    height: 56,
    margin: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1E2D3D',
  } as ViewStyle,
});
