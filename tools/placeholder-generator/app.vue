<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <div class="flex justify-between items-center mb-4">
          <div class="flex-1"></div>
          <div class="flex-1 text-center">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Placeholder Generator</h1>
          </div>
          <div class="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Generate custom placeholder images with various sizes, colors, and text options</p>
      </header>

      <div class="max-w-6xl mx-auto">
        <!-- Settings Panel -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Image Settings</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Size Settings -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Size</h3>
              
              <div>
                <label for="width" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Width</label>
                <input
                  id="width"
                  v-model.number="settings.width"
                  type="number"
                  min="1"
                  max="2000"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label for="height" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Height</label>
                <input
                  id="height"
                  v-model.number="settings.height"
                  type="number"
                  min="1"
                  max="2000"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <input
                    v-model="settings.maintainAspectRatio"
                    type="checkbox"
                    class="rounded text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  />
                  Lock aspect ratio
                </label>
              </div>
            </div>

            <!-- Colors -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Colors</h3>
              
              <div>
                <label for="background-color" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Background</label>
                <div class="flex gap-2">
                  <input
                    id="background-color"
                    v-model="settings.backgroundColor"
                    type="color"
                    class="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                  <input
                    v-model="settings.backgroundColor"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label for="text-color" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Text</label>
                <div class="flex gap-2">
                  <input
                    id="text-color"
                    v-model="settings.textColor"
                    type="color"
                    class="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  />
                  <input
                    v-model="settings.textColor"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <!-- Text Settings -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Text</h3>
              
              <div>
                <label for="custom-text" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Custom Text</label>
                <input
                  id="custom-text"
                  v-model="settings.customText"
                  type="text"
                  placeholder="Enter custom text..."
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label for="font-size" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Font Size</label>
                <input
                  id="font-size"
                  v-model.number="settings.fontSize"
                  type="number"
                  min="8"
                  max="100"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label for="font-family" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Font</label>
                <select
                  id="font-family"
                  v-model="settings.fontFamily"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times">Times</option>
                  <option value="Courier">Courier</option>
                </select>
              </div>
            </div>

            <!-- Format Settings -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Format</h3>
              
              <div>
                <label for="format" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">File Format</label>
                <select
                  id="format"
                  v-model="settings.format"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="webp">WebP</option>
                  <option value="svg">SVG</option>
                </select>
              </div>
              
              <div v-if="settings.format === 'jpg'">
                <label for="quality" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Quality ({{ settings.quality }}%)</label>
                <input
                  id="quality"
                  v-model.number="settings.quality"
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Preset Sizes -->
          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preset Sizes</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="preset in presetSizes"
                :key="preset.name"
                @click="applyPreset(preset)"
                class="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {{ preset.name }} ({{ preset.width }}×{{ preset.height }})
              </button>
            </div>
          </div>
        </div>

        <!-- Preview and Generation -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Preview -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Preview</h3>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ settings.width }}×{{ settings.height }}</span>
            </div>
            
            <div class="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg min-h-[300px] transition-colors">
              <div class="relative">
                <canvas
                  ref="previewCanvas"
                  :width="previewWidth"
                  :height="previewHeight"
                  class="border border-gray-200 rounded shadow-sm"
                />
                <div v-if="isGenerating" class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 rounded">
                  <div class="text-sm text-gray-600 dark:text-gray-400">Generating...</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
            
            <div class="space-y-4">
              <!-- URL Generation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generated URL</label>
                <div class="flex gap-2">
                  <input
                    v-model="generatedUrl"
                    type="text"
                    readonly
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none transition-colors"
                  />
                  <button
                    @click="copyUrl"
                    class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Use this URL directly in your HTML or CSS
                </p>
              </div>

              <!-- Download Options -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Download</label>
                <div class="space-y-2">
                  <button
                    @click="downloadImage"
                    class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Download Image
                  </button>
                  <button
                    @click="copyToClipboard"
                    class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>

              <!-- HTML/CSS Code -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">HTML Code</label>
                <textarea
                  v-model="htmlCode"
                  readonly
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono transition-colors"
                />
                <button
                  @click="copyCode('html')"
                  class="mt-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  Copy HTML
                </button>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CSS Background</label>
                <textarea
                  v-model="cssCode"
                  readonly
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono transition-colors"
                />
                <button
                  @click="copyCode('css')"
                  class="mt-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  Copy CSS
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Usage Examples -->
        <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Common Use Cases</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
              <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Website Design</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Use placeholders during development to visualize layout before final images are ready.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
              <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Prototyping</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Quickly create mockups with consistent placeholder images for presentations.</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
              <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Testing</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Generate images of specific sizes to test responsive design and loading behavior.</p>
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

    <!-- Ko-fi Widget Container (for testing) -->
    <div v-if="kofiWidget.state.value.isVisible" data-testid="kofi-widget" class="kofi-widget-container"></div>
</template>

<script setup lang="ts">
import { useKofiWidget } from '~/shared/composables/useKofiWidget'
import KOFI_CONFIG from '~/shared/config/kofi'
interface PlaceholderSettings {
  width: number
  height: number
  backgroundColor: string
  textColor: string
  customText: string
  fontSize: number
  fontFamily: string
  format: 'png' | 'jpg' | 'webp' | 'svg'
  quality: number
  maintainAspectRatio: boolean
}

interface PresetSize {
  name: string
  width: number
  height: number
}

// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

const settings = ref<PlaceholderSettings>({
  width: 300,
  height: 200,
  backgroundColor: '#cccccc',
  textColor: '#333333',
  customText: '',
  fontSize: 20,
  fontFamily: 'Arial',
  format: 'png',
  quality: 80,
  maintainAspectRatio: false
})

const previewCanvas = ref<HTMLCanvasElement>()
const isGenerating = ref(false)
const copyMessage = ref('')

const presetSizes: PresetSize[] = [
  { name: 'Avatar', width: 150, height: 150 },
  { name: 'Card', width: 300, height: 200 },
  { name: 'Banner', width: 728, height: 90 },
  { name: 'Square', width: 400, height: 400 },
  { name: 'Landscape', width: 800, height: 600 },
  { name: 'Portrait', width: 600, height: 800 },
  { name: 'HD', width: 1920, height: 1080 },
  { name: 'Mobile', width: 375, height: 667 }
]

const previewWidth = computed(() => {
  const maxWidth = 400
  const ratio = Math.min(maxWidth / settings.value.width, maxWidth / settings.value.height, 1)
  return settings.value.width * ratio
})

const previewHeight = computed(() => {
  const maxWidth = 400
  const ratio = Math.min(maxWidth / settings.value.width, maxWidth / settings.value.height, 1)
  return settings.value.height * ratio
})

const displayText = computed(() => {
  return settings.value.customText || `${settings.value.width}×${settings.value.height}`
})

const generatedUrl = computed(() => {
  // Determine base URL based on environment
  const isDevEnvironment = process.client && window.location.hostname.includes('dev.devtools.site')
  const baseUrl = isDevEnvironment 
    ? 'https://placeholder-generator.dev.devtools.site'
    : 'https://placeholder-generator.devtools.site'
  
  const bg = settings.value.backgroundColor.replace('#', '')
  const text = settings.value.textColor.replace('#', '')
  const size = `${settings.value.width}x${settings.value.height}`
  const format = settings.value.format === 'jpg' ? 'jpg' : 'png'
  
  let url = `${baseUrl}/${bg}/${text}/${size}.${format}`
  
  if (settings.value.customText) {
    url += `?text=${encodeURIComponent(settings.value.customText)}`
  }
  
  return url
})

const htmlCode = computed(() => {
  return `<img src="${generatedUrl.value}" alt="Placeholder ${settings.value.width}x${settings.value.height}" width="${settings.value.width}" height="${settings.value.height}">`
})

const cssCode = computed(() => {
  return `background-image: url('${generatedUrl.value}');\nbackground-size: cover;`
})

const previousAspectRatio = ref(settings.value.width / settings.value.height)

watch(() => settings.value.width, (newWidth, oldWidth) => {
  if (settings.value.maintainAspectRatio && oldWidth && oldWidth !== newWidth) {
    settings.value.height = Math.round(newWidth / previousAspectRatio.value)
  } else {
    previousAspectRatio.value = settings.value.width / settings.value.height
  }
  generatePreview()
})

watch(() => settings.value.height, (newHeight, oldHeight) => {
  if (settings.value.maintainAspectRatio && oldHeight && oldHeight !== newHeight) {
    settings.value.width = Math.round(newHeight * previousAspectRatio.value)
  } else {
    previousAspectRatio.value = settings.value.width / settings.value.height
  }
  generatePreview()
})

watch(settings, () => {
  generatePreview()
}, { deep: true })

const generatePreview = () => {
  if (!previewCanvas.value) return
  
  isGenerating.value = true
  
  nextTick(() => {
    const canvas = previewCanvas.value!
    const ctx = canvas.getContext('2d')!
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw background
    ctx.fillStyle = settings.value.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw text
    ctx.fillStyle = settings.value.textColor
    ctx.font = `${Math.max(10, settings.value.fontSize * (canvas.width / settings.value.width))}px ${settings.value.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const text = displayText.value
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    
    isGenerating.value = false
  })
}

const applyPreset = (preset: PresetSize) => {
  settings.value.width = preset.width
  settings.value.height = preset.height
  previousAspectRatio.value = preset.width / preset.height
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(generatedUrl.value)
    showCopyMessage('URL copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy URL:', err)
  }
}

const copyCode = async (type: 'html' | 'css') => {
  try {
    const text = type === 'html' ? htmlCode.value : cssCode.value
    await navigator.clipboard.writeText(text)
    showCopyMessage(`${type.toUpperCase()} code copied to clipboard!`)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}

const downloadImage = () => {
  if (!previewCanvas.value) return
  
  // Create a new canvas with actual dimensions
  const canvas = document.createElement('canvas')
  canvas.width = settings.value.width
  canvas.height = settings.value.height
  const ctx = canvas.getContext('2d')!
  
  // Draw at full size
  ctx.fillStyle = settings.value.backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  ctx.fillStyle = settings.value.textColor
  ctx.font = `${settings.value.fontSize}px ${settings.value.fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  ctx.fillText(displayText.value, canvas.width / 2, canvas.height / 2)
  
  // Download
  const link = document.createElement('a')
  link.download = `placeholder-${settings.value.width}x${settings.value.height}.${settings.value.format}`
  link.href = canvas.toDataURL(`image/${settings.value.format}`, settings.value.quality / 100)
  link.click()
}

const copyToClipboard = async () => {
  if (!previewCanvas.value) return
  
  try {
    // Create a new canvas with actual dimensions
    const canvas = document.createElement('canvas')
    canvas.width = settings.value.width
    canvas.height = settings.value.height
    const ctx = canvas.getContext('2d')!
    
    // Draw at full size
    ctx.fillStyle = settings.value.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = settings.value.textColor
    ctx.font = `${settings.value.fontSize}px ${settings.value.fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    ctx.fillText(displayText.value, canvas.width / 2, canvas.height / 2)
    
    // Convert to blob and copy
    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
          showCopyMessage('Image copied to clipboard!')
        } catch (err) {
          console.error('Failed to copy image:', err)
          showCopyMessage('Failed to copy image to clipboard')
        }
      }
    })
  } catch (err) {
    console.error('Failed to copy image:', err)
  }
}

const showCopyMessage = (message: string) => {
  copyMessage.value = message
  setTimeout(() => {
    copyMessage.value = ''
  }, 2000)
}

onMounted(() => {
  kofiWidget.init(KOFI_CONFIG)
  kofiWidget.load()
  generatePreview()
  
  // Initialize dark mode
  const { initializeTheme } = useDarkMode()

// Initialize Ko-fi widget
const kofiWidget = useKofiWidget()
  initializeTheme()
})
</script>