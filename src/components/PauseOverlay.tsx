import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface PauseOverlayProps {
  onResume: () => void;
  onHome: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  onResume,
  onHome,
}) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>PAUSED</Text>
        <TouchableOpacity style={styles.resumeBtn} onPress={onResume}>
          <Text style={styles.resumeText}>▶  RESUME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeBtn} onPress={onHome}>
          <Text style={styles.homeText}>🏠  HOME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 27, 42, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  } as ViewStyle,
  card: {
    backgroundColor: '#1E2D3D',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: 260,
    borderWidth: 1,
    borderColor: '#2E75B6',
  } as ViewStyle,
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    letterSpacing: 4,
  } as TextStyle,
  resumeBtn: {
    backgroundColor: '#1A56A0',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  resumeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  } as TextStyle,
  homeBtn: {
    backgroundColor: '#2E75B6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  homeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  } as TextStyle,
});
