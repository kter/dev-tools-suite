<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <header class="text-center mb-8">
        <div class="flex justify-between items-center mb-4">
          <div class="flex-1"></div>
          <div class="flex-1 text-center">
            <h1 class="text-4xl font-bold mb-2">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Timezone Converter
          </span>
        </h1>
          </div>
          <div class="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Convert time between different timezones with ease</p>
      </header>

      <div class="max-w-4xl mx-auto">
        <!-- Current Time -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 transition-colors">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Time</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-colors">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Local Time</h3>
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ currentLocalTime }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ userTimezone }}</div>
            </div>
            <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl transition-colors">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">UTC</h3>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ currentUtcTime }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Coordinated Universal Time</div>
            </div>
            <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl transition-colors">
              <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Unix Timestamp</h3>
              <div class="text-xl font-bold text-purple-600 dark:text-purple-400">{{ currentUnixTime }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Seconds since epoch</div>
            </div>
          </div>
        </div>

        <!-- Time Converter -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 transition-colors">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Convert Time</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- From Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">From</h3>
              
              <div>
                <label for="from-timezone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Source Timezone</label>
                <select
                  id="from-timezone"
                  v-model="fromTimezone"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option v-for="tz in commonTimezones" :key="tz.value" :value="tz.value">
                    {{ tz.label }}
                  </option>
                </select>
              </div>

              <div>
                <label for="from-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <input
                  id="from-date"
                  v-model="fromDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label for="from-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                <input
                  id="from-time"
                  v-model="fromTime"
                  type="time"
                  step="1"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-colors">
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Full DateTime</div>
                <div class="font-medium text-blue-800 dark:text-blue-200">{{ formatFromDateTime }}</div>
              </div>
            </div>

            <!-- To Section -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">To</h3>
              
              <div>
                <label for="to-timezone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Timezone</label>
                <select
                  id="to-timezone"
                  v-model="toTimezone"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option v-for="tz in commonTimezones" :key="tz.value" :value="tz.value">
                    {{ tz.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Converted Date</label>
                <input
                  :value="convertedDate"
                  type="date"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Converted Time</label>
                <input
                  :value="convertedTime"
                  type="time"
                  step="1"
                  readonly
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>

              <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl transition-colors">
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Full DateTime</div>
                <div class="font-medium text-green-800 dark:text-green-200">{{ formatToDateTime }}</div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="mt-6 flex flex-wrap gap-2">
            <button
              @click="setCurrentTime"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Use Current Time
            </button>
            <button
              @click="swapTimezones"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Swap Timezones
            </button>
            <button
              @click="copyResult"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Copy Result
            </button>
          </div>

          <!-- Time Difference -->
          <div v-if="timeDifference" class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl transition-colors">
            <div class="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Time Difference:</strong> {{ timeDifference }}
            </div>
          </div>
        </div>

        <!-- Multiple Timezone Display -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 transition-colors">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">World Clock</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="worldTime in worldTimes"
              :key="worldTime.timezone"
              class="p-4 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl transition-colors"
            >
              <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-1">{{ worldTime.city }}</h3>
              <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ worldTime.time }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ worldTime.date }}</div>
              <div class="text-xs text-gray-400 dark:text-gray-500">{{ worldTime.timezone }}</div>
            </div>
          </div>
        </div>

        <!-- Timezone Information -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Timezone Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-3">{{ getTimezoneInfo(fromTimezone).name }}</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">UTC Offset:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ getTimezoneInfo(fromTimezone).offset }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">DST:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ getTimezoneInfo(fromTimezone).dst ? 'Yes' : 'No' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Abbreviation:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ getTimezoneInfo(fromTimezone).abbreviation }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-3">{{ getTimezoneInfo(toTimezone).name }}</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">UTC Offset:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ getTimezoneInfo(toTimezone).offset }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">DST:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ getTimezoneInfo(toTimezone).dst ? 'Yes' : 'No' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Abbreviation:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ getTimezoneInfo(toTimezone).abbreviation }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Copy notification -->
      <div v-if="copyMessage" class="fixed bottom-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-colors">
        {{ copyMessage }}
      </div>
    </div>
  </div>

    <!-- Universal Support Me Button -->
    <KofiButton kofi-username="kterr" />
</template>

<script setup lang="ts">
import KofiButton from '../shared/components/KofiButton.vue'
import { format, parse, addHours } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime, format as formatTz } from 'date-fns-tz'

interface TimezoneOption {
  value: string
  label: string
  offset?: string
  abbreviation?: string
}

// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

// Initialize dark mode
const { initializeTheme } = useDarkMode()

// Initialize Ko-fi widget

const fromTimezone = ref('America/New_York')
const toTimezone = ref('Asia/Tokyo')
const fromDate = ref('')
const fromTime = ref('')
const copyMessage = ref('')

const currentLocalTime = ref('')
const currentUtcTime = ref('')
const currentUnixTime = ref('')
const userTimezone = ref('')

const commonTimezones: TimezoneOption[] = [
  { value: 'UTC', label: 'UTC - Coordinated Universal Time' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
  { value: 'America/Mexico_City', label: 'Mexico City (CST)' }
]

const worldClockTimezones = [
  { city: 'New York', timezone: 'America/New_York' },
  { city: 'London', timezone: 'Europe/London' },
  { city: 'Paris', timezone: 'Europe/Paris' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo' },
  { city: 'Sydney', timezone: 'Australia/Sydney' },
  { city: 'Dubai', timezone: 'Asia/Dubai' }
]

const convertedDateTime = computed(() => {
  if (!fromDate.value || !fromTime.value) return null
  
  try {
    const dateTimeString = `${fromDate.value} ${fromTime.value}`
    const sourceDate = parse(dateTimeString, 'yyyy-MM-dd HH:mm:ss', new Date())
    const utcDate = zonedTimeToUtc(sourceDate, fromTimezone.value)
    const convertedDate = utcToZonedTime(utcDate, toTimezone.value)
    return convertedDate
  } catch (error) {
    console.error('Date conversion error:', error)
    return null
  }
})

const convertedDate = computed(() => {
  if (!convertedDateTime.value) return ''
  return format(convertedDateTime.value, 'yyyy-MM-dd')
})

const convertedTime = computed(() => {
  if (!convertedDateTime.value) return ''
  return format(convertedDateTime.value, 'HH:mm:ss')
})

const formatFromDateTime = computed(() => {
  if (!fromDate.value || !fromTime.value) return 'Select date and time'
  
  try {
    const dateTimeString = `${fromDate.value} ${fromTime.value}`
    const sourceDate = parse(dateTimeString, 'yyyy-MM-dd HH:mm:ss', new Date())
    return formatTz(sourceDate, 'PPpp zzz', { timeZone: fromTimezone.value })
  } catch (error) {
    return 'Invalid date/time'
  }
})

const formatToDateTime = computed(() => {
  if (!convertedDateTime.value) return 'Convert time first'
  return formatTz(convertedDateTime.value, 'PPpp zzz', { timeZone: toTimezone.value })
})

const timeDifference = computed(() => {
  if (!convertedDateTime.value) return ''
  
  try {
    const fromOffset = getTimezoneOffset(fromTimezone.value)
    const toOffset = getTimezoneOffset(toTimezone.value)
    const diffHours = toOffset - fromOffset
    
    if (diffHours === 0) return 'Same timezone'
    if (diffHours > 0) return `${diffHours} hours ahead`
    return `${Math.abs(diffHours)} hours behind`
  } catch (error) {
    return ''
  }
})

const worldTimes = computed(() => {
  return worldClockTimezones.map(wt => {
    const now = new Date()
    const zonedTime = utcToZonedTime(now, wt.timezone)
    
    return {
      city: wt.city,
      timezone: wt.timezone,
      time: format(zonedTime, 'HH:mm:ss'),
      date: format(zonedTime, 'MMM dd, yyyy')
    }
  })
})

const updateCurrentTime = () => {
  const now = new Date()
  
  currentLocalTime.value = format(now, 'HH:mm:ss')
  currentUtcTime.value = format(utcToZonedTime(now, 'UTC'), 'HH:mm:ss')
  currentUnixTime.value = Math.floor(now.getTime() / 1000).toString()
  
  if (process.client) {
    userTimezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}

const setCurrentTime = () => {
  const now = new Date()
  fromDate.value = format(now, 'yyyy-MM-dd')
  fromTime.value = format(now, 'HH:mm:ss')
}

const swapTimezones = () => {
  const temp = fromTimezone.value
  fromTimezone.value = toTimezone.value
  toTimezone.value = temp
}

const copyResult = async () => {
  if (!convertedDateTime.value) return
  
  const result = `${formatFromDateTime.value} → ${formatToDateTime.value}`
  
  try {
    await navigator.clipboard.writeText(result)
    showCopyMessage('Conversion result copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
    showCopyMessage('Failed to copy to clipboard')
  }
}

const getTimezoneOffset = (timezone: string): number => {
  const now = new Date()
  const utc = utcToZonedTime(now, 'UTC')
  const tz = utcToZonedTime(now, timezone)
  return (tz.getTime() - utc.getTime()) / (1000 * 60 * 60)
}

const getTimezoneInfo = (timezone: string) => {
  const now = new Date()
  const zonedTime = utcToZonedTime(now, timezone)
  const offset = getTimezoneOffset(timezone)
  
  const offsetHours = Math.floor(Math.abs(offset))
  const offsetMinutes = Math.round((Math.abs(offset) - offsetHours) * 60)
  const offsetString = `UTC${offset >= 0 ? '+' : '-'}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`
  
  let abbreviation = ''
  try {
    const formatted = formatTz(zonedTime, 'zzz', { timeZone: timezone })
    abbreviation = formatted
  } catch (error) {
    abbreviation = timezone.split('/').pop() || timezone
  }
  
  const isDST = isInDST(timezone, now)
  
  return {
    name: timezone.replace(/_/g, ' ').split('/').pop() || timezone,
    offset: offsetString,
    dst: isDST,
    abbreviation
  }
}

const isInDST = (timezone: string, date: Date): boolean => {
  try {
    const january = new Date(date.getFullYear(), 0, 1)
    const july = new Date(date.getFullYear(), 6, 1)
    
    const janOffset = getTimezoneOffsetAt(timezone, january)
    const julOffset = getTimezoneOffsetAt(timezone, july)
    const currentOffset = getTimezoneOffsetAt(timezone, date)
    
    return Math.max(janOffset, julOffset) === currentOffset
  } catch (error) {
    return false
  }
}

const getTimezoneOffsetAt = (timezone: string, date: Date): number => {
  const utc = utcToZonedTime(date, 'UTC')
  const tz = utcToZonedTime(date, timezone)
  return (tz.getTime() - utc.getTime()) / (1000 * 60 * 60)
}

const showCopyMessage = (message: string) => {
  copyMessage.value = message
  setTimeout(() => {
    copyMessage.value = ''
  }, 2000)
}

onMounted(() => {
  setCurrentTime()
  updateCurrentTime()
  
  // Update current time every second
  setInterval(updateCurrentTime, 1000)
  
  // Set user's timezone as default
  if (process.client) {
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone
    fromTimezone.value = userTz
  }

  initializeTheme()
})
</script>