<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <header class="text-center mb-12 relative">
        <!-- Theme Toggle -->
        <div class="absolute right-0 top-0">
          <ThemeToggle />
        </div>
        
        <h1 class="text-4xl font-bold mb-2">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Unix Time Converter
          </span>
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Convert between Unix timestamps and human-readable dates
        </p>
      </header>

      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Current Time Display -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Time</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unix Timestamp</label>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono text-lg text-gray-900 dark:text-white">{{ currentUnixTime }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Human Readable</label>
              <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">{{ currentHumanTime }}</div>
            </div>
          </div>
        </div>

        <!-- Unix to Human Converter -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Unix Timestamp to Date</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unix Timestamp</label>
              <input
                v-model="unixInput"
                type="number"
                placeholder="1640995200"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                @input="convertUnixToHuman"
              />
            </div>
            <div v-if="unixResult.local" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Local Time</label>
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">{{ unixResult.local }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">UTC Time</label>
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">{{ unixResult.utc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Human to Unix Converter -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Date to Unix Timestamp</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <input
                  v-model="dateInput"
                  type="date"
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  @input="convertHumanToUnix"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                <input
                  v-model="timeInput"
                  type="time"
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  @input="convertHumanToUnix"
                />
              </div>
            </div>
            <div v-if="humanResult.local" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unix Timestamp (Local)</label>
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono text-gray-900 dark:text-white">{{ humanResult.local }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unix Timestamp (UTC)</label>
                <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono text-gray-900 dark:text-white">{{ humanResult.utc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Common Timestamps -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Common Timestamps</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-for="preset in commonTimestamps"
              :key="preset.name"
              @click="usePreset(preset.timestamp)"
              class="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
            >
              <div class="font-semibold text-gray-900 dark:text-white">{{ preset.name }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-300 font-mono">{{ preset.timestamp }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ preset.description }}</div>
            </button>
          </div>
        </div>
      </div>

      <footer class="mt-16 text-center text-gray-500 dark:text-gray-400">
        <p>All conversions are performed locally in your browser</p>
      </footer>
    </div>
  </div>

    <!-- Universal Support Me Button -->
    <KofiButton kofi-username="kterr" />
</template>

<script setup lang="ts">
import KofiButton from '../shared/components/KofiButton.vue'
// SEO protection for dev environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

useHead({
  title: 'Unix Time Converter - DevTools'
})

// Reactive data
const currentUnixTime = ref(0)
const currentHumanTime = ref('')
const unixInput = ref('')
const dateInput = ref('')
const timeInput = ref('')

const unixResult = ref({
  local: '',
  utc: ''
})

const humanResult = ref({
  local: '',
  utc: ''
})

// Common timestamps
const commonTimestamps = [
  {
    name: 'Unix Epoch',
    timestamp: 0,
    description: 'January 1, 1970'
  },
  {
    name: 'Y2K',
    timestamp: 946684800,
    description: 'January 1, 2000'
  },
  {
    name: '2038 Problem',
    timestamp: 2147483647,
    description: 'January 19, 2038'
  },
  {
    name: 'New Year 2024',
    timestamp: 1704067200,
    description: 'January 1, 2024'
  },
  {
    name: 'New Year 2025',
    timestamp: 1735689600,
    description: 'January 1, 2025'
  },
  {
    name: 'New Year 2030',
    timestamp: 1893456000,
    description: 'January 1, 2030'
  }
]

// Update current time every second
const updateCurrentTime = () => {
  const now = new Date()
  currentUnixTime.value = Math.floor(now.getTime() / 1000)
  currentHumanTime.value = now.toLocaleString()
}

// Convert Unix timestamp to human readable
const convertUnixToHuman = () => {
  if (!unixInput.value) {
    unixResult.value = { local: '', utc: '' }
    return
  }

  const timestamp = parseInt(unixInput.value)
  if (isNaN(timestamp)) {
    unixResult.value = { local: 'Invalid timestamp', utc: 'Invalid timestamp' }
    return
  }

  const date = new Date(timestamp * 1000)
  unixResult.value = {
    local: date.toLocaleString(),
    utc: date.toUTCString()
  }
}

// Convert human readable to Unix timestamp
const convertHumanToUnix = () => {
  if (!dateInput.value || !timeInput.value) {
    humanResult.value = { local: '', utc: '' }
    return
  }

  const localDate = new Date(`${dateInput.value}T${timeInput.value}`)
  const utcDate = new Date(`${dateInput.value}T${timeInput.value}Z`)

  if (isNaN(localDate.getTime()) || isNaN(utcDate.getTime())) {
    humanResult.value = { local: 'Invalid date/time', utc: 'Invalid date/time' }
    return
  }

  humanResult.value = {
    local: Math.floor(localDate.getTime() / 1000).toString(),
    utc: Math.floor(utcDate.getTime() / 1000).toString()
  }
}

// Use preset timestamp
const usePreset = (timestamp: number) => {
  unixInput.value = timestamp.toString()
  convertUnixToHuman()
}

// Dark mode
const { initializeTheme } = useDarkMode()

// Initialize Ko-fi widget

// Initialize
onMounted(() => {
  // Initialize theme
  initializeTheme()
  
  updateCurrentTime()
  // Update current time every second
  setInterval(updateCurrentTime, 1000)
  
  // Set default date and time to current
  const now = new Date()
  dateInput.value = now.toISOString().split('T')[0]
  timeInput.value = now.toTimeString().split(' ')[0].substring(0, 5)
  convertHumanToUnix()
})
</script>