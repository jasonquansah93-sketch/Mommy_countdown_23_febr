import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDesign } from '../context/DesignContext';

interface MomentOptionsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MomentOptionsBottomSheet({
  visible,
  onClose,
  onEdit,
  onDelete,
}: MomentOptionsBottomSheetProps) {
  const { colors } = useDesign();
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backdropAnim]);

  const backdropOpacity = backdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
          pointerEvents="auto"
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={[styles.handleBar, { backgroundColor: colors.textSecondary }]} />
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <Text style={styles.headerTitle}>Moment Options</Text>
          </LinearGradient>
          <View style={[styles.optionsContent, { borderTopColor: colors.accent }]}>
            <TouchableOpacity
              style={[styles.optionBtn, styles.optionPrimary]}
              onPress={() => {
                onClose();
                onEdit();
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.optionGradient}
              >
                <Text style={styles.optionPrimaryText}>Edit Moment</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, styles.optionDestructive]}
              onPress={() => {
                onClose();
                onDelete();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.optionDestructiveText}>Delete Moment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionBtn, styles.optionCancel, { borderColor: colors.accent }]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionCancelText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    paddingBottom: 34,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  optionsContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  optionBtn: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionPrimary: {
    overflow: 'hidden',
  },
  optionGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  optionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  optionDestructive: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  optionDestructiveText: {
    color: '#E53935',
    fontSize: 17,
    fontWeight: '600',
  },
  optionCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  optionCancelText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
