<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
    <div class="container mx-auto max-w-4xl px-4">
      <!-- Header -->
      <div class="text-center mb-8 relative">
        <!-- Theme Toggle -->
        <div class="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">QR Code Generator</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">Generate QR codes from text, URLs, or any content instantly</p>
      </div>

      <!-- Input Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200">
        <div class="mb-4">
          <label for="text-input" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Enter text or URL
          </label>
          <textarea
            id="text-input"
            v-model="inputText"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            rows="4"
            placeholder="Enter text, URL, or any content to generate QR code..."
            @input="generateQRCode"
          ></textarea>
        </div>

        <!-- Error Correction Level -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Error Correction Level
          </label>
          <select 
            v-model="errorCorrectionLevel"
            @change="generateQRCode"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>

        <!-- Size Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            QR Code Size
          </label>
          <select 
            v-model="qrSize"
            @change="generateQRCode"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
          >
            <option value="200">Small (200x200)</option>
            <option value="300">Medium (300x300)</option>
            <option value="400">Large (400x400)</option>
            <option value="500">Extra Large (500x500)</option>
          </select>
        </div>
      </div>

      <!-- QR Code Display -->
      <div v-if="inputText.trim()" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <div class="text-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Generated QR Code</h2>
          
          <div class="flex justify-center mb-6">
            <div class="p-4 bg-white dark:bg-gray-100 rounded-lg shadow-lg">
              <canvas 
                ref="qrCanvas" 
                class="mx-auto"
                :width="qrSize"
                :height="qrSize"
              ></canvas>
            </div>
          </div>

          <!-- Download Button -->
          <div class="flex justify-center gap-4">
            <button
              @click="downloadQRCode"
              class="px-6 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
            >
              📄 Download PNG
            </button>
            <button
              @click="downloadQRCodeSVG"
              class="px-6 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-md transition-colors font-medium"
            >
              📊 Download SVG
            </button>
          </div>

          <!-- QR Code Info -->
          <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <span class="font-medium">Size:</span> {{ qrSize }}x{{ qrSize }}px
              </div>
              <div>
                <span class="font-medium">Error Correction:</span> {{ errorCorrectionLevel }} Level
              </div>
              <div>
                <span class="font-medium">Characters:</span> {{ inputText.length }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors duration-200">
        <div class="text-gray-500 dark:text-gray-400">
          <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">How to use</h2>
          <p class="mb-4">Enter any text, URL, or content in the text area above to instantly generate a QR code.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
              <h3 class="font-medium mb-2 text-gray-900 dark:text-white">📱 Website URLs</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">https://example.com</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
              <h3 class="font-medium mb-2 text-gray-900 dark:text-white">📧 Email Address</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">mailto:user@example.com</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
              <h3 class="font-medium mb-2 text-gray-900 dark:text-white">📞 Phone Number</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">tel:+1234567890</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
              <h3 class="font-medium mb-2 text-gray-900 dark:text-white">💬 Plain Text</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">Any text content</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Copy Message -->
      <div v-if="copyMessage" class="fixed bottom-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-md shadow-lg transition-colors duration-200">
        {{ copyMessage }}
      </div>
    </div>
  </div>

    <!-- Ko-fi Widget Container (for testing) -->
    <div v-if="kofiWidget.state.value.isVisible" data-testid="kofi-widget" class="kofi-widget-container"></div>
</template>

<script setup lang="ts">
import { useKofiWidget } from '~/shared/composables/useKofiWidget'
import KOFI_CONFIG from '~/shared/config/kofi'
import QRCode from 'qrcode'

// Initialize dark mode
const { initializeTheme } = useDarkMode()

// Initialize Ko-fi widget
const kofiWidget = useKofiWidget()

// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

// Initialize dark mode on mount
onMounted(() => {
  kofiWidget.init(KOFI_CONFIG)
  kofiWidget.load()
  initializeTheme()
  // Generate initial QR code if there's default text
  if (inputText.value.trim()) {
    generateQRCode()
  }
})

const inputText = ref('')
const errorCorrectionLevel = ref('M')
const qrSize = ref('300')
const copyMessage = ref('')
const qrCanvas = ref<HTMLCanvasElement>()

const generateQRCode = async () => {
  if (!inputText.value.trim() || !qrCanvas.value) return

  try {
    // QR codes should always use black on white for maximum readability and compatibility
    await QRCode.toCanvas(qrCanvas.value, inputText.value, {
      errorCorrectionLevel: errorCorrectionLevel.value as any,
      width: parseInt(qrSize.value),
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

const downloadQRCode = () => {
  if (!qrCanvas.value) return
  
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = qrCanvas.value.toDataURL()
  link.click()
  
  showCopyMessage('QR Code downloaded as PNG!')
}

const downloadQRCodeSVG = async () => {
  if (!inputText.value.trim()) return

  try {
    const svgString = await QRCode.toString(inputText.value, {
      type: 'svg',
      errorCorrectionLevel: errorCorrectionLevel.value as any,
      width: parseInt(qrSize.value),
      margin: 2
    })
    
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.download = 'qrcode.svg'
    link.href = url
    link.click()
    
    URL.revokeObjectURL(url)
    showCopyMessage('QR Code downloaded as SVG!')
  } catch (error) {
    console.error('Error generating SVG:', error)
  }
}

const showCopyMessage = (message: string) => {
  copyMessage.value = message
  setTimeout(() => {
    copyMessage.value = ''
  }, 3000)
}

// Generate QR code when input text changes
watch(inputText, generateQRCode)
</script>