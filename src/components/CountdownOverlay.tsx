import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CountdownOverlayProps {
  onCountdownDone: () => void;
}

const STEPS = ['3', '2', '1', 'START!'];

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  onCountdownDone,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(false);

  useEffect(() => {
    let current = 0;
    doneRef.current = false;

    function runStep(idx: number) {
      if (doneRef.current) return;
      setStepIndex(idx);
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(1);

      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }),
        Animated.delay(600),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished || doneRef.current) return;
        const next = idx + 1;
        if (next < STEPS.length) {
          runStep(next);
        } else {
          // Small delay after START! then call done
          setTimeout(() => {
            if (!doneRef.current) {
              doneRef.current = true;
              onCountdownDone();
            }
          }, 500);
        }
      });
    }

    runStep(0);

    return () => {
      doneRef.current = true;
    };
  }, []);

  return (
    <View style={styles.overlay}>
      <Animated.Text
        style={[
          styles.text,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {STEPS[stepIndex]}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 27, 42, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  } as ViewStyle,
  text: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace' as any,
  } as TextStyle,
});
