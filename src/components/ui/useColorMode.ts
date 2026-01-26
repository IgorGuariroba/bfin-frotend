import { useTheme } from 'next-themes';

type ColorMode = 'light' | 'dark';

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const colorMode = (resolvedTheme === 'dark' ? 'dark' : 'light') as ColorMode;

  const setColorMode = (value: ColorMode) => setTheme(value);
  const toggleColorMode = () => {
    setTheme(colorMode === 'dark' ? 'light' : 'dark');
  };

  return { colorMode, setColorMode, toggleColorMode };
}

export function useColorModeValue<T>(lightValue: T, darkValue: T): T {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? darkValue : lightValue;
}
