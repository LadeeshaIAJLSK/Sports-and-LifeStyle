import { useColorScheme } from './use-color-scheme';

const tintColorLight = '#A8FF00';
const tintColorDark = '#A8FF00';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#F5F7FA',
    tint: tintColorLight,
    icon: '#666',
    tabIconDefault: '#999',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#1A1A1A',
    tint: tintColorDark,
    icon: '#999',
    tabIconDefault: '#666',
    tabIconSelected: tintColorDark,
  },
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
