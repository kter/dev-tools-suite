<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Unix Time Converter</h1>
        <p class="text-gray-600">Convert between Unix timestamps and human-readable dates</p>
      </header>

      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Current Time Display -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Current Time</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-blue-50 rounded p-3">
              <label class="block text-sm font-medium text-blue-700 mb-1">Unix Timestamp</label>
              <div class="text-lg font-mono text-blue-900">{{ currentUnixTime }}</div>
            </div>
            <div class="bg-green-50 rounded p-3">
              <label class="block text-sm font-medium text-green-700 mb-1">Human Readable</label>
              <div class="text-lg text-green-900">{{ currentDateTime }}</div>
            </div>
          </div>
        </div>

        <!-- Unix to Date Converter -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Unix Timestamp to Date</h3>
          <div class="space-y-4">
            <div>
              <label for="unix-input" class="block text-sm font-medium text-gray-700 mb-2">
                Unix Timestamp
              </label>
              <input
                id="unix-input"
                v-model="unixInput"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="1640995200"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded p-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Local Time</label>
                <div class="text-gray-900">{{ unixToLocal }}</div>
              </div>
              <div class="bg-gray-50 rounded p-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">UTC Time</label>
                <div class="text-gray-900">{{ unixToUtc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Date to Unix Converter -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Date to Unix Timestamp</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="date-input" class="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  id="date-input"
                  v-model="dateInput"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label for="time-input" class="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  id="time-input"
                  v-model="timeInput"
                  type="time"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded p-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Unix Timestamp (Local)</label>
                <div class="text-gray-900 font-mono">{{ dateToUnixLocal }}</div>
              </div>
              <div class="bg-gray-50 rounded p-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Unix Timestamp (UTC)</label>
                <div class="text-gray-900 font-mono">{{ dateToUnixUtc }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Common Timestamps -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Common Timestamps</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="common in commonTimestamps"
              :key="common.name"
              class="bg-gray-50 rounded p-3 cursor-pointer hover:bg-gray-100 transition-colors"
              @click="setUnixInput(common.timestamp)"
            >
              <div class="text-sm font-medium text-gray-700">{{ common.name }}</div>
              <div class="text-xs text-gray-500 font-mono">{{ common.timestamp }}</div>
              <div class="text-sm text-gray-600">{{ formatTimestamp(common.timestamp) }}</div>
            </div>
          </div>
        </div>

        <!-- Copy Success Message -->
        <div v-if="copyMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {{ copyMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

const unixInput = ref('')
const dateInput = ref('')
const timeInput = ref('')
const copyMessage = ref('')

// Current time reactive values
const currentUnixTime = ref(0)
const currentDateTime = ref('')

// Initialize with current time
const initializeCurrentTime = () => {
  const now = new Date()
  currentUnixTime.value = Math.floor(now.getTime() / 1000)
  currentDateTime.value = now.toLocaleString()
}

// Update current time every second
let timeInterval: NodeJS.Timeout | null = null

onMounted(() => {
  initializeCurrentTime()
  timeInterval = setInterval(initializeCurrentTime, 1000)
  
  // Set default date/time inputs to current time
  const now = new Date()
  dateInput.value = now.toISOString().split('T')[0]
  timeInput.value = now.toTimeString().substring(0, 5)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// Unix to Date conversions
const unixToLocal = computed(() => {
  if (!unixInput.value || isNaN(Number(unixInput.value))) {
    return 'Invalid timestamp'
  }
  
  const timestamp = Number(unixInput.value)
  const date = new Date(timestamp * 1000)
  
  if (isNaN(date.getTime())) {
    return 'Invalid timestamp'
  }
  
  return date.toLocaleString()
})

const unixToUtc = computed(() => {
  if (!unixInput.value || isNaN(Number(unixInput.value))) {
    return 'Invalid timestamp'
  }
  
  const timestamp = Number(unixInput.value)
  const date = new Date(timestamp * 1000)
  
  if (isNaN(date.getTime())) {
    return 'Invalid timestamp'
  }
  
  return date.toUTCString()
})

// Date to Unix conversions
const dateToUnixLocal = computed(() => {
  if (!dateInput.value || !timeInput.value) {
    return 'Select date and time'
  }
  
  const dateTime = new Date(`${dateInput.value}T${timeInput.value}`)
  
  if (isNaN(dateTime.getTime())) {
    return 'Invalid date/time'
  }
  
  return Math.floor(dateTime.getTime() / 1000)
})

const dateToUnixUtc = computed(() => {
  if (!dateInput.value || !timeInput.value) {
    return 'Select date and time'
  }
  
  const dateTime = new Date(`${dateInput.value}T${timeInput.value}:00.000Z`)
  
  if (isNaN(dateTime.getTime())) {
    return 'Invalid date/time'
  }
  
  return Math.floor(dateTime.getTime() / 1000)
})

// Common timestamps
const commonTimestamps = [
  {
    name: 'Unix Epoch',
    timestamp: 0
  },
  {
    name: 'Y2K',
    timestamp: 946684800
  },
  {
    name: '2010-01-01',
    timestamp: 1262304000
  },
  {
    name: '2020-01-01',
    timestamp: 1577836800
  },
  {
    name: '2030-01-01',
    timestamp: 1893456000
  },
  {
    name: 'One Week Ago',
    timestamp: Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000)
  }
]

// Helper functions
const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString()
}

const setUnixInput = (timestamp: number) => {
  unixInput.value = timestamp.toString()
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copyMessage.value = 'Copied to clipboard!'
    setTimeout(() => {
      copyMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>