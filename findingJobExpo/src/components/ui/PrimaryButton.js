import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';

export default function PrimaryButton({ title, onPress, color, outline, style }) {
  const backgroundColor = outline ? 'transparent' : (color || colors.primary);
  const borderColor = color || colors.primary;
  const textColor = outline ? (color || colors.primary) : '#FFFFFF';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor },
        outline && styles.outline,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    borderWidth: 1,
  },
  outline: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
});
