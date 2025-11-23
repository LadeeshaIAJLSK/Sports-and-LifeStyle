import { View, type ViewProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode
    ? darkColor || '#1A1A1A'
    : lightColor || '#F5F7FA';

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}