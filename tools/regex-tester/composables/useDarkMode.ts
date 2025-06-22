// 共通のダークモード管理 Composable
export const useDarkMode = () => {
  const isDarkMode = ref(false)
  const isSystemDark = ref(false)
  const theme = ref<'light' | 'dark' | 'system'>('system')

  // システムのダークモード設定を検出
  const detectSystemDarkMode = () => {
    if (process.client) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  }

  // テーマを適用
  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    if (!process.client) return

    theme.value = newTheme
    
    // localStorage に保存
    localStorage.setItem('theme', newTheme)
    
    // 実際のダークモード状態を決定
    let shouldBeDark = false
    
    if (newTheme === 'dark') {
      shouldBeDark = true
    } else if (newTheme === 'light') {
      shouldBeDark = false
    } else { // system
      shouldBeDark = isSystemDark.value
    }
    
    isDarkMode.value = shouldBeDark
    
    // HTML要素にclass追加/削除
    const htmlElement = document.documentElement
    if (shouldBeDark) {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }

  // 初期化
  const initializeTheme = () => {
    if (!process.client) return

    // システムダークモード検出
    isSystemDark.value = detectSystemDarkMode()
    
    // システムダークモード変更の監視
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      isSystemDark.value = e.matches
      if (theme.value === 'system') {
        applyTheme('system')
      }
    })

    // 保存されたテーマ設定を読み込み
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system'
    applyTheme(savedTheme)
  }

  // テーマ切り替え
  const toggleTheme = () => {
    const currentTheme = theme.value
    let newTheme: 'light' | 'dark' | 'system'
    
    // light -> dark -> system -> light の順で切り替え
    if (currentTheme === 'light') {
      newTheme = 'dark'
    } else if (currentTheme === 'dark') {
      newTheme = 'system'
    } else {
      newTheme = 'light'
    }
    
    applyTheme(newTheme)
  }

  // 特定のテーマに設定
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    applyTheme(newTheme)
  }

  // テーマアイコンを取得
  const getThemeIcon = () => {
    if (theme.value === 'light') {
      return '☀️'
    } else if (theme.value === 'dark') {
      return '🌙'
    } else {
      return '💻'
    }
  }

  // テーマ名を取得
  const getThemeName = () => {
    if (theme.value === 'light') {
      return 'Light'
    } else if (theme.value === 'dark') {
      return 'Dark'
    } else {
      return 'System'
    }
  }

  return {
    isDarkMode: readonly(isDarkMode),
    isSystemDark: readonly(isSystemDark),
    theme: readonly(theme),
    initializeTheme,
    toggleTheme,
    setTheme,
    getThemeIcon,
    getThemeName
  }
}