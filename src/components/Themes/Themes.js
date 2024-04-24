import { useState, useLayoutEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('green');

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, setTheme };
};
