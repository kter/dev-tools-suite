import { ref } from 'vue';

export function useDarkMode() {
  const isDark = ref(false);

  const initializeTheme = () => {
    // Simple theme initialization
    if (import.meta.client) {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      isDark.value = stored === 'dark' || (!stored && prefersDark);

      if (isDark.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;

    if (import.meta.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  const getThemeIcon = () => {
    return isDark.value ? '☀️' : '🌙';
  };

  const getThemeName = () => {
    return isDark.value ? 'Light' : 'Dark';
  };

  return {
    isDark,
    initializeTheme,
    toggleTheme,
    getThemeIcon,
    getThemeName
  };
}
