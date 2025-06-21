<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">IP Calculator</h1>
        <p class="text-gray-600">Calculate subnet masks, network addresses, and IP ranges</p>
      </header>

      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <label for="ip-input" class="block text-sm font-medium text-gray-700 mb-2">
            IP Address with CIDR (e.g., 192.168.1.1/24)
          </label>
          <input
            id="ip-input"
            v-model="ipInput"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="192.168.1.1/24"
          />
          <div v-if="inputError" class="mt-2 text-red-600 text-sm">
            {{ inputError }}
          </div>
        </div>

        <div v-if="calculation" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Network Information</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">IP Address:</span>
                <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ calculation.ipAddress }}</code>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Subnet Mask:</span>
                <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ calculation.subnetMask }}</code>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">CIDR Notation:</span>
                <code class="text-sm bg-gray-100 px-2 py-1 rounded">/{{ calculation.cidr }}</code>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Network Address:</span>
                <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ calculation.networkAddress }}</code>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Broadcast Address:</span>
                <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ calculation.broadcastAddress }}</code>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Host Information</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">First Host:</span>
                <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ calculation.firstHost }}</code>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Last Host:</span>
                <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ calculation.lastHost }}</code>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Total Hosts:</span>
                <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ calculation.totalHosts.toLocaleString() }}</code>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Usable Hosts:</span>
                <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ calculation.usableHosts.toLocaleString() }}</code>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Network Class:</span>
                <code class="text-sm bg-gray-100 px-2 py-1 rounded">{{ calculation.networkClass }}</code>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Binary Representation</h3>
            <div class="space-y-2">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span class="text-gray-600 text-sm">IP Address (Binary):</span>
                  <code class="block text-xs bg-gray-100 p-2 rounded mt-1 font-mono">{{ calculation.ipBinary }}</code>
                </div>
                <div>
                  <span class="text-gray-600 text-sm">Subnet Mask (Binary):</span>
                  <code class="block text-xs bg-gray-100 p-2 rounded mt-1 font-mono">{{ calculation.subnetMaskBinary }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IPCalculation {
  ipAddress: string
  subnetMask: string
  cidr: number
  networkAddress: string
  broadcastAddress: string
  firstHost: string
  lastHost: string
  totalHosts: number
  usableHosts: number
  networkClass: string
  ipBinary: string
  subnetMaskBinary: string
}

// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

const ipInput = ref('192.168.1.1/24')
const inputError = ref('')

const calculation = computed(() => {
  try {
    inputError.value = ''
    return calculateIP(ipInput.value)
  } catch (error) {
    inputError.value = (error as Error).message
    return null
  }
})

function calculateIP(input: string): IPCalculation {
  const parts = input.trim().split('/')
  if (parts.length !== 2) {
    throw new Error('Please enter IP address in CIDR notation (e.g., 192.168.1.1/24)')
  }

  const ipAddress = parts[0]
  const cidr = parseInt(parts[1])

  if (!isValidIP(ipAddress)) {
    throw new Error('Invalid IP address format')
  }

  if (cidr < 0 || cidr > 32) {
    throw new Error('CIDR must be between 0 and 32')
  }

  const ipParts = ipAddress.split('.').map(part => parseInt(part))
  const ipInt = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3]
  
  const subnetMaskInt = (0xFFFFFFFF << (32 - cidr)) >>> 0
  const networkInt = (ipInt & subnetMaskInt) >>> 0
  const broadcastInt = (networkInt | (0xFFFFFFFF >>> cidr)) >>> 0
  
  const totalHosts = Math.pow(2, 32 - cidr)
  const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0

  return {
    ipAddress,
    subnetMask: intToIP(subnetMaskInt),
    cidr,
    networkAddress: intToIP(networkInt),
    broadcastAddress: intToIP(broadcastInt),
    firstHost: intToIP(networkInt + 1),
    lastHost: intToIP(broadcastInt - 1),
    totalHosts,
    usableHosts,
    networkClass: getNetworkClass(ipParts[0]),
    ipBinary: ipToBinary(ipAddress),
    subnetMaskBinary: ipToBinary(intToIP(subnetMaskInt))
  }
}

function isValidIP(ip: string): boolean {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  
  return parts.every(part => {
    const num = parseInt(part)
    return !isNaN(num) && num >= 0 && num <= 255
  })
}

function intToIP(int: number): string {
  return [
    (int >>> 24) & 0xFF,
    (int >>> 16) & 0xFF,
    (int >>> 8) & 0xFF,
    int & 0xFF
  ].join('.')
}

function getNetworkClass(firstOctet: number): string {
  if (firstOctet >= 1 && firstOctet <= 126) return 'A'
  if (firstOctet >= 128 && firstOctet <= 191) return 'B'
  if (firstOctet >= 192 && firstOctet <= 223) return 'C'
  if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)'
  if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reserved)'
  return 'Unknown'
}

function ipToBinary(ip: string): string {
  return ip.split('.')
    .map(octet => parseInt(octet).toString(2).padStart(8, '0'))
    .join('.')
}
</script>