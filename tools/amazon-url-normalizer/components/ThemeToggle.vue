<template>
  <div class="theme-toggle">
    <!-- デスクトップ版 -->
    <div class="hidden md:flex items-center gap-2">
      <button
        @click="handleToggle"
        class="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105
               bg-white dark:bg-gray-800
               border-gray-300 dark:border-gray-600
               text-gray-700 dark:text-gray-300
               hover:bg-gray-50 dark:hover:bg-gray-700
               shadow-sm hover:shadow-md"
        :title="`Current theme: ${getThemeName()}`"
      >
        <span class="text-lg transition-transform duration-300 hover:rotate-12">
          {{ getThemeIcon() }}
        </span>
        <span class="text-sm font-medium">{{ getThemeName() }}</span>
      </button>
    </div>

    <!-- モバイル版（アイコンのみ） -->
    <div class="md:hidden">
      <button
        @click="handleToggle"
        class="w-10 h-10 rounded-full border transition-all duration-200
               bg-white dark:bg-gray-800
               border-gray-300 dark:border-gray-600
               text-gray-700 dark:text-gray-300
               hover:bg-gray-50 dark:hover:bg-gray-700
               shadow-sm hover:shadow-md
               flex items-center justify-center"
        :title="`Current theme: ${getThemeName()}`"
      >
        <span class="text-lg transition-transform duration-300 hover:rotate-12">
          {{ getThemeIcon() }}
        </span>
      </button>
    </div>

    <!-- テーマ切り替え時のフィードバック -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-75"
    >
      <div
        v-if="showFeedback"
        class="fixed top-4 right-4 z-50
               bg-white dark:bg-gray-800
               border border-gray-300 dark:border-gray-600
               text-gray-700 dark:text-gray-300
               px-4 py-2 rounded-lg shadow-lg
               flex items-center gap-2"
      >
        <span class="text-lg">{{ getThemeIcon() }}</span>
        <span class="text-sm font-medium">{{ getThemeName() }} mode</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { toggleTheme, getThemeIcon, getThemeName } = useDarkMode()

const showFeedback = ref(false)

// テーマ変更時のフィードバック表示
const handleToggle = () => {
  toggleTheme()

  // フィードバック表示
  showFeedback.value = true
  setTimeout(() => {
    showFeedback.value = false
  }, 1500)
}
</script>

<style scoped>
.theme-toggle {
  /* カスタムスタイルがあれば追加 */
}
</style>
