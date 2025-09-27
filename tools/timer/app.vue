<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <header class="text-center mb-8 relative">
        <div class="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <h1 class="text-4xl font-bold mb-2">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Timer
          </span>
        </h1>
        <p class="text-gray-600 dark:text-gray-300">Countdown timer, stopwatch, and Pomodoro technique timer</p>
      </header>

      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Timer Mode Selection -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Timer Mode</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              @click="setMode('countdown')"
              class="p-4 rounded-lg border-2 transition-all duration-200 text-left"
              :class="mode === 'countdown' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 text-gray-700 dark:text-gray-300'"
            >
              <div class="flex items-center gap-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 class="font-semibold">Countdown</h3>
                  <p class="text-sm opacity-75">Set a specific time to count down</p>
                </div>
              </div>
            </button>
            
            <button
              @click="setMode('stopwatch')"
              class="p-4 rounded-lg border-2 transition-all duration-200 text-left"
              :class="mode === 'stopwatch' 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 text-gray-700 dark:text-gray-300'"
            >
              <div class="flex items-center gap-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <div>
                  <h3 class="font-semibold">Stopwatch</h3>
                  <p class="text-sm opacity-75">Count up from zero</p>
                </div>
              </div>
            </button>
            
            <button
              @click="setMode('pomodoro')"
              class="p-4 rounded-lg border-2 transition-all duration-200 text-left"
              :class="mode === 'pomodoro' 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' 
                : 'border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 text-gray-700 dark:text-gray-300'"
            >
              <div class="flex items-center gap-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
                <div>
                  <h3 class="font-semibold">Pomodoro</h3>
                  <p class="text-sm opacity-75">25min work + 5min break cycles</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Timer Settings -->
        <div v-if="mode === 'countdown'" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Set Timer</h3>
          <div class="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div class="text-center">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">Hours</label>
              <input
                v-model.number="hours"
                type="number"
                min="0"
                max="23"
                class="w-full px-3 py-2 text-center text-lg border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :disabled="isRunning"
              />
            </div>
            <div class="text-center">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">Minutes</label>
              <input
                v-model.number="minutes"
                type="number"
                min="0"
                max="59"
                class="w-full px-3 py-2 text-center text-lg border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :disabled="isRunning"
              />
            </div>
            <div class="text-center">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">Seconds</label>
              <input
                v-model.number="seconds"
                type="number"
                min="0"
                max="59"
                class="w-full px-3 py-2 text-center text-lg border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :disabled="isRunning"
              />
            </div>
          </div>
          
          <!-- Quick Timer Presets -->
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Timers</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                v-for="preset in timerPresets"
                :key="preset.label"
                @click="setPreset(preset.minutes, preset.seconds || 0)"
                class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                :disabled="isRunning"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Pomodoro Settings -->
        <div v-if="mode === 'pomodoro'" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pomodoro Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div class="text-center">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">Work Duration</label>
              <input
                v-model.number="pomodoroSettings.workMinutes"
                type="number"
                min="1"
                max="60"
                class="w-full px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :disabled="isRunning"
              />
              <span class="text-xs text-gray-500">minutes</span>
            </div>
            <div class="text-center">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">Short Break</label>
              <input
                v-model.number="pomodoroSettings.shortBreakMinutes"
                type="number"
                min="1"
                max="30"
                class="w-full px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :disabled="isRunning"
              />
              <span class="text-xs text-gray-500">minutes</span>
            </div>
            <div class="text-center">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">Long Break</label>
              <input
                v-model.number="pomodoroSettings.longBreakMinutes"
                type="number"
                min="1"
                max="60"
                class="w-full px-3 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                :disabled="isRunning"
              />
              <span class="text-xs text-gray-500">minutes</span>
            </div>
          </div>
          
          <!-- Pomodoro Status -->
          <div class="mt-4 text-center">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Session {{ pomodoroSession }} of {{ pomodoroSettings.sessionsUntilLongBreak }}
            </div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {{ pomodoroPhase === 'work' ? '🍅 Work Time' : pomodoroPhase === 'shortBreak' ? '☕ Short Break' : '🛋️ Long Break' }}
            </div>
          </div>
        </div>

        <!-- Timer Display -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <div class="text-center">
            <!-- Time Display -->
            <div class="text-6xl md:text-8xl font-mono font-bold text-gray-900 dark:text-white mb-6 tracking-wider">
              {{ formatTime(displayTime) }}
            </div>
            
            <!-- Progress Bar -->
            <div v-if="mode !== 'stopwatch'" class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6">
              <div 
                class="h-3 rounded-full transition-all duration-1000 ease-linear"
                :class="getProgressBarColor()"
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
            
            <!-- Controls -->
            <div class="flex justify-center gap-4">
              <button
                @click="startStop"
                class="px-8 py-3 text-lg font-semibold rounded-lg transition-colors focus:outline-none focus:ring-4"
                :class="isRunning 
                  ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300' 
                  : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-300'"
              >
                {{ isRunning ? 'Pause' : 'Start' }}
              </button>
              
              <button
                @click="reset"
                class="px-8 py-3 text-lg font-semibold bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Reset
              </button>
              
              <button
                v-if="mode === 'stopwatch'"
                @click="lap"
                :disabled="!isRunning"
                class="px-8 py-3 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300"
              >
                Lap
              </button>
            </div>
          </div>
        </div>

        <!-- Lap Times (Stopwatch) -->
        <div v-if="mode === 'stopwatch' && lapTimes.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lap Times</h3>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div
              v-for="(lapTime, index) in lapTimes.slice().reverse()"
              :key="lapTimes.length - index"
              class="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <span class="text-gray-600 dark:text-gray-400">Lap {{ lapTimes.length - index }}</span>
              <span class="font-mono font-semibold text-gray-900 dark:text-white">{{ formatTime(lapTime) }}</span>
            </div>
          </div>
        </div>

        <!-- Timer Complete Modal -->
        <div v-if="showCompleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="dismissModal">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 text-center" @click.stop>
            <div class="text-6xl mb-4">
              {{ mode === 'pomodoro' && pomodoroPhase === 'work' ? '🍅' : '⏰' }}
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Time's Up!</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              {{ getCompleteMessage() }}
            </p>
            <div class="flex gap-3 justify-center">
              <button
                @click="dismissModal"
                class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Dismiss
              </button>
              <button
                v-if="mode === 'pomodoro'"
                @click="nextPomodoroPhase"
                class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                {{ pomodoroPhase === 'work' ? 'Start Break' : 'Start Work' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Initialize dark mode
const { initializeTheme } = useDarkMode()

// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

// Timer mode
const mode = ref<'countdown' | 'stopwatch' | 'pomodoro'>('countdown')

// Timer state
const isRunning = ref(false)
const displayTime = ref(0) // in milliseconds
const intervalId = ref<NodeJS.Timeout | null>(null)

// Countdown settings
const hours = ref(0)
const minutes = ref(5)
const seconds = ref(0)
const totalTime = ref(0)

// Stopwatch
const lapTimes = ref<number[]>([])

// Pomodoro settings
const pomodoroSettings = ref({
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsUntilLongBreak: 4
})
const pomodoroSession = ref(1)
const pomodoroPhase = ref<'work' | 'shortBreak' | 'longBreak'>('work')

// Modal
const showCompleteModal = ref(false)

// Timer presets
const timerPresets = [
  { label: '30 sec', minutes: 0, seconds: 30 },
  { label: '1 min', minutes: 1 },
  { label: '5 min', minutes: 5 },
  { label: '10 min', minutes: 10 },
  { label: '15 min', minutes: 15 },
  { label: '20 min', minutes: 20 },
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 }
]

// Computed
const progressPercentage = computed(() => {
  if (mode.value === 'stopwatch' || totalTime.value === 0) return 0
  return Math.max(0, Math.min(100, ((totalTime.value - displayTime.value) / totalTime.value) * 100))
})

// Methods
const setMode = (newMode: 'countdown' | 'stopwatch' | 'pomodoro') => {
  if (isRunning.value) return
  mode.value = newMode
  reset()
}

const setPreset = (mins: number, secs: number = 0) => {
  if (isRunning.value) return
  hours.value = 0
  minutes.value = mins
  seconds.value = secs
}

const formatTime = (timeMs: number): string => {
  const totalSeconds = Math.floor(timeMs / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const getProgressBarColor = () => {
  switch (mode.value) {
    case 'countdown':
      return 'bg-indigo-600'
    case 'pomodoro':
      return pomodoroPhase.value === 'work' ? 'bg-red-600' : 'bg-green-600'
    default:
      return 'bg-gray-600'
  }
}

const startStop = () => {
  if (isRunning.value) {
    pause()
  } else {
    start()
  }
}

const start = () => {
  if (mode.value === 'countdown' || mode.value === 'pomodoro') {
    if (displayTime.value === 0) {
      setupCountdown()
    }
  }
  
  isRunning.value = true
  const startTime = Date.now()
  const initialTime = displayTime.value
  
  intervalId.value = setInterval(() => {
    const elapsed = Date.now() - startTime
    
    if (mode.value === 'stopwatch') {
      displayTime.value = initialTime + elapsed
    } else {
      displayTime.value = Math.max(0, initialTime - elapsed)
      
      if (displayTime.value === 0) {
        complete()
      }
    }
  }, 100)
}

const pause = () => {
  isRunning.value = false
  if (intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = null
  }
}

const reset = () => {
  pause()
  
  if (mode.value === 'countdown') {
    displayTime.value = 0
    totalTime.value = 0
  } else if (mode.value === 'stopwatch') {
    displayTime.value = 0
    lapTimes.value = []
  } else if (mode.value === 'pomodoro') {
    setupPomodoro()
  }
}

const setupCountdown = () => {
  const totalMs = (hours.value * 3600 + minutes.value * 60 + seconds.value) * 1000
  displayTime.value = totalMs
  totalTime.value = totalMs
}

const setupPomodoro = () => {
  const duration = pomodoroPhase.value === 'work' 
    ? pomodoroSettings.value.workMinutes
    : pomodoroPhase.value === 'shortBreak'
    ? pomodoroSettings.value.shortBreakMinutes
    : pomodoroSettings.value.longBreakMinutes
    
  const totalMs = duration * 60 * 1000
  displayTime.value = totalMs
  totalTime.value = totalMs
}

const lap = () => {
  if (mode.value === 'stopwatch' && isRunning.value) {
    lapTimes.value.push(displayTime.value)
  }
}

const complete = () => {
  pause()
  showCompleteModal.value = true
  
  // Play notification sound if possible
  if (process.client) {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaDD2U2/LBbSEEOJPc9NmlRAoSYL3n6qNPFAg+ltrywnAhBTmN2fLPeSUGJ3bH8N2QQAkUXrTp66hVFAlFnODyu1ySAA')
      audio.play().catch(() => {
        // Silently fail if audio doesn't work
      })
    } catch (error) {
      // Silently fail if audio doesn't work
    }
  }
}

const dismissModal = () => {
  showCompleteModal.value = false
}

const getCompleteMessage = () => {
  if (mode.value === 'pomodoro') {
    if (pomodoroPhase.value === 'work') {
      return 'Work session complete! Time for a break.'
    } else {
      return 'Break time is over! Ready to get back to work?'
    }
  }
  return 'Your timer has finished!'
}

const nextPomodoroPhase = () => {
  dismissModal()
  
  if (pomodoroPhase.value === 'work') {
    // After work, determine break type
    if (pomodoroSession.value % pomodoroSettings.value.sessionsUntilLongBreak === 0) {
      pomodoroPhase.value = 'longBreak'
    } else {
      pomodoroPhase.value = 'shortBreak'
    }
  } else {
    // After any break, go back to work
    pomodoroPhase.value = 'work'
    if (pomodoroPhase.value === 'work') {
      pomodoroSession.value++
    }
  }
  
  setupPomodoro()
  start()
}

// Initialize theme and setup
onMounted(() => {
  initializeTheme()
  reset()
})

// Cleanup
onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})
</script>