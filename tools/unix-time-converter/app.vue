<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-12">
      <header class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Unix Time Converter
          </span>
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Convert between Unix timestamps and human-readable dates
        </p>
      </header>

      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Current Time Display -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Current Time</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Unix Timestamp</label>
              <div class="p-3 bg-gray-50 rounded-lg font-mono text-lg">{{ currentUnixTime }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Human Readable</label>
              <div class="p-3 bg-gray-50 rounded-lg">{{ currentHumanTime }}</div>
            </div>
          </div>
        </div>

        <!-- Unix to Human Converter -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Unix Timestamp to Date</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Unix Timestamp</label>
              <input
                v-model="unixInput"
                type="number"
                placeholder="1640995200"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="convertUnixToHuman"
              />
            </div>
            <div v-if="unixResult.local" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Local Time</label>
                <div class="p-3 bg-gray-50 rounded-lg">{{ unixResult.local }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">UTC Time</label>
                <div class="p-3 bg-gray-50 rounded-lg">{{ unixResult.utc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Human to Unix Converter -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Date to Unix Timestamp</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  v-model="dateInput"
                  type="date"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @input="convertHumanToUnix"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  v-model="timeInput"
                  type="time"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  @input="convertHumanToUnix"
                />
              </div>
            </div>
            <div v-if="humanResult.local" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Unix Timestamp (Local)</label>
                <div class="p-3 bg-gray-50 rounded-lg font-mono">{{ humanResult.local }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Unix Timestamp (UTC)</label>
                <div class="p-3 bg-gray-50 rounded-lg font-mono">{{ humanResult.utc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Common Timestamps -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Common Timestamps</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-for="preset in commonTimestamps"
              :key="preset.name"
              @click="usePreset(preset.timestamp)"
              class="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
            >
              <div class="font-semibold text-gray-900">{{ preset.name }}</div>
              <div class="text-sm text-gray-600 font-mono">{{ preset.timestamp }}</div>
              <div class="text-xs text-gray-500">{{ preset.description }}</div>
            </button>
          </div>
        </div>
      </div>

      <footer class="mt-16 text-center text-gray-500">
        <p>All conversions are performed locally in your browser</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
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

// Initialize
onMounted(() => {
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