<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <div class="flex justify-between items-center mb-4">
          <div class="flex-1"></div>
          <div class="flex-1 text-center">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">IP Info</h1>
          </div>
          <div class="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Display your IP address information including location, ISP, and network details</p>
      </header>

      <div class="max-w-4xl mx-auto">
        <!-- Your IP Address -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 text-center transition-colors">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your IP Address</h2>
          <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {{ ipInfo?.ip || 'Loading...' }}
          </div>
          <div v-if="ipInfo?.type" class="text-sm text-gray-500 dark:text-gray-400">
            {{ ipInfo.type }} Address
          </div>
          <div class="mt-4 flex justify-center gap-4">
            <button
              @click="copyToClipboard(ipInfo?.ip || '')"
              :disabled="!ipInfo?.ip"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Copy IP
            </button>
            <button
              @click="refreshInfo"
              :disabled="loading"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {{ loading ? 'Refreshing...' : 'Refresh' }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && !ipInfo" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 text-center transition-colors">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p class="text-gray-600 dark:text-gray-400">Loading IP information...</p>
        </div>

        <!-- Error State -->
        <div v-if="error" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 text-center transition-colors">
          <div class="text-red-600 dark:text-red-400 mb-4">
            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to load IP information</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
          <button
            @click="refreshInfo"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- IP Information Details -->
        <div v-if="ipInfo && !loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Location Information -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Location Information
            </h3>
            <div class="space-y-3">
              <div v-if="ipInfo.country" class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Country:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ ipInfo.country }}</span>
              </div>
              <div v-if="ipInfo.country_code" class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Country Code:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ ipInfo.country_code }}</span>
              </div>
              <div v-if="ipInfo.region" class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Region:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ ipInfo.region }}</span>
              </div>
              <div v-if="ipInfo.city" class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">City:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ ipInfo.city }}</span>
              </div>
              <div v-if="ipInfo.postal" class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Postal Code:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ ipInfo.postal }}</span>
              </div>
              <div v-if="ipInfo.latitude && ipInfo.longitude" class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Coordinates:</span>
                <span class="font-medium text-sm text-gray-900 dark:text-white">{{ ipInfo.latitude }}, {{ ipInfo.longitude }}</span>
              </div>
              <div v-if="ipInfo.timezone" class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Timezone:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ ipInfo.timezone }}</span>
              </div>
            </div>
          </div>

          <!-- Network Information -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
              </svg>
              Network Information
            </h3>
            <div class="space-y-3">
              <div v-if="ipInfo.org" class="flex justify-between items-start">
                <span class="text-gray-600 dark:text-gray-400">ISP/Organization:</span>
                <span class="font-medium text-right ml-2 text-gray-900 dark:text-white">{{ ipInfo.org }}</span>
              </div>
              <div v-if="ipInfo.asn" class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">ASN:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ ipInfo.asn }}</span>
              </div>
              <div v-if="ipInfo.type" class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Address Type:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ ipInfo.type }}</span>
              </div>
              <div v-if="ipInfo.version" class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">IP Version:</span>
                <span class="font-medium text-gray-900 dark:text-white">IPv{{ ipInfo.version }}</span>
              </div>
            </div>
          </div>

          <!-- Security & Privacy -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              Security & Privacy
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Connection:</span>
                <span class="font-medium text-green-600 dark:text-green-400">{{ isSecure ? 'Secure (HTTPS)' : 'Insecure (HTTP)' }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">IPv6 Support:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ ipInfo.version === 6 ? 'Yes' : 'Unknown' }}</span>
              </div>
              <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg transition-colors">
                <p class="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Privacy Note:</strong> This information is publicly visible to websites you visit. Consider using a VPN for enhanced privacy.
                </p>
              </div>
            </div>
          </div>

          <!-- Additional Tools -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Quick Actions
            </h3>
            <div class="space-y-3">
              <button
                @click="copyAllInfo"
                class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Copy All Information
              </button>
              <a
                v-if="ipInfo?.latitude && ipInfo?.longitude"
                :href="`https://www.google.com/maps?q=${ipInfo.latitude},${ipInfo.longitude}`"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block text-center"
              >
                View on Map
              </a>
              <button
                @click="checkOtherIP"
                class="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Check Other IP
              </button>
            </div>
          </div>
        </div>

        <!-- Custom IP Lookup -->
        <div v-if="showCustomLookup" class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lookup Custom IP Address</h3>
          <div class="flex gap-2">
            <input
              v-model="customIP"
              type="text"
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              @keyup.enter="lookupCustomIP"
            />
            <button
              @click="lookupCustomIP"
              :disabled="!customIP || loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Lookup
            </button>
            <button
              @click="showCustomLookup = false"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <!-- Information Source -->
        <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>IP information provided by multiple geolocation services</p>
          <p>Last updated: {{ lastUpdated }}</p>
        </div>
      </div>

      <!-- Copy notification -->
      <div v-if="copyMessage" class="fixed bottom-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-colors">
        {{ copyMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IPInfo {
  ip: string
  type?: string
  version?: number
  country?: string
  country_code?: string
  region?: string
  city?: string
  postal?: string
  latitude?: number
  longitude?: number
  timezone?: string
  org?: string
  asn?: string
}

// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

const ipInfo = ref<IPInfo | null>(null)
const loading = ref(false)
const error = ref('')
const copyMessage = ref('')
const showCustomLookup = ref(false)
const customIP = ref('')
const lastUpdated = ref('')

const isSecure = computed(() => {
  if (process.client) {
    return window.location.protocol === 'https:'
  }
  return true
})

const fetchIPInfo = async (ip?: string) => {
  loading.value = true
  error.value = ''
  
  try {
    // Try multiple services for better reliability
    const services = [
      ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/',
      ip ? `https://ip-api.com/json/${ip}` : 'https://ip-api.com/json',
    ]
    
    let result = null
    
    for (const service of services) {
      try {
        const response = await fetch(service)
        if (response.ok) {
          const data = await response.json()
          
          // Normalize data from different services
          if (service.includes('ipapi.co')) {
            result = {
              ip: data.ip,
              type: data.version === 4 ? 'IPv4' : data.version === 6 ? 'IPv6' : undefined,
              version: data.version,
              country: data.country_name,
              country_code: data.country_code,
              region: data.region,
              city: data.city,
              postal: data.postal,
              latitude: data.latitude,
              longitude: data.longitude,
              timezone: data.timezone,
              org: data.org,
              asn: data.asn
            }
          } else if (service.includes('ip-api.com')) {
            result = {
              ip: data.query,
              country: data.country,
              country_code: data.countryCode,
              region: data.regionName,
              city: data.city,
              postal: data.zip,
              latitude: data.lat,
              longitude: data.lon,
              timezone: data.timezone,
              org: data.isp,
              asn: data.as
            }
          }
          
          if (result && result.ip) {
            break
          }
        }
      } catch (serviceError) {
        console.warn(`Service ${service} failed:`, serviceError)
        continue
      }
    }
    
    if (!result) {
      throw new Error('All IP information services are currently unavailable')
    }
    
    ipInfo.value = result
    lastUpdated.value = new Date().toLocaleString()
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch IP information'
    console.error('Failed to fetch IP info:', err)
  } finally {
    loading.value = false
  }
}

const refreshInfo = () => {
  showCustomLookup.value = false
  customIP.value = ''
  fetchIPInfo()
}

const lookupCustomIP = () => {
  if (!customIP.value.trim()) return
  
  // Basic IP validation
  const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  
  if (!ipPattern.test(customIP.value.trim())) {
    error.value = 'Please enter a valid IP address'
    return
  }
  
  fetchIPInfo(customIP.value.trim())
  showCustomLookup.value = false
}

const checkOtherIP = () => {
  showCustomLookup.value = true
  customIP.value = ''
}

const copyToClipboard = async (text: string) => {
  if (!text) return
  
  try {
    await navigator.clipboard.writeText(text)
    showCopyMessage('Copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
    showCopyMessage('Failed to copy to clipboard')
  }
}

const copyAllInfo = async () => {
  if (!ipInfo.value) return
  
  const info = [
    `IP Address: ${ipInfo.value.ip}`,
    ipInfo.value.type ? `Type: ${ipInfo.value.type}` : '',
    ipInfo.value.country ? `Country: ${ipInfo.value.country}` : '',
    ipInfo.value.region ? `Region: ${ipInfo.value.region}` : '',
    ipInfo.value.city ? `City: ${ipInfo.value.city}` : '',
    ipInfo.value.postal ? `Postal: ${ipInfo.value.postal}` : '',
    ipInfo.value.timezone ? `Timezone: ${ipInfo.value.timezone}` : '',
    ipInfo.value.org ? `ISP: ${ipInfo.value.org}` : '',
    ipInfo.value.latitude && ipInfo.value.longitude ? `Coordinates: ${ipInfo.value.latitude}, ${ipInfo.value.longitude}` : '',
  ].filter(Boolean).join('\n')
  
  await copyToClipboard(info)
}

const showCopyMessage = (message: string) => {
  copyMessage.value = message
  setTimeout(() => {
    copyMessage.value = ''
  }, 2000)
}

onMounted(() => {
  fetchIPInfo()
  
  // Initialize dark mode
  const { initializeTheme } = useDarkMode()
  initializeTheme()
})
</script>