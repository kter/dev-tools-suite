<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <header class="text-center mb-8 relative">
        <div class="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <h1 class="text-4xl font-bold mb-2">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Image Converter
          </span>
        </h1>
        <p class="text-gray-600 dark:text-gray-300">Convert image formats and resize images online</p>
      </header>

      <div class="max-w-4xl mx-auto space-y-6">
        <!-- File Upload Area -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Image</h2>
            
            <div
              @drop="onDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center transition-colors"
              :class="{ 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20': isDragging }"
              @dragenter="isDragging = true"
              @dragleave="isDragging = false"
            >
              <div v-if="!selectedImage" class="space-y-4">
                <div class="text-4xl text-gray-400 dark:text-gray-500">📁</div>
                <div>
                  <p class="text-gray-600 dark:text-gray-300 mb-2">
                    Drag and drop an image here, or
                  </p>
                  <label class="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      @change="onFileSelect"
                      class="hidden"
                    />
                    <span class="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded cursor-pointer transition-colors">
                      Choose File
                    </span>
                  </label>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Supported formats: JPEG, PNG, WebP, GIF
                </p>
              </div>
              
              <div v-else class="space-y-4">
                <div class="text-2xl text-green-500">✅</div>
                <p class="text-gray-700 dark:text-gray-300">{{ selectedImage.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(selectedImage.size) }}
                </p>
                <button
                  @click="clearImage"
                  class="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Conversion Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Conversion Settings</h3>
          
          <div class="space-y-4">
            <!-- Output Format -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Format
              </label>
              <select
                v-model="outputFormat"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            <!-- Quality (for JPEG and WebP) -->
            <div v-if="outputFormat === 'jpeg' || outputFormat === 'webp'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quality: {{ quality }}%
              </label>
              <input
                v-model="quality"
                type="range"
                min="10"
                max="100"
                step="5"
                class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-xl appearance-none cursor-pointer"
              />
            </div>

            <!-- Resize Options -->
            <div>
              <label class="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <input
                  v-model="enableResize"
                  type="checkbox"
                  class="mr-2 text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600"
                />
                Resize Image
              </label>
            </div>

            <div v-if="enableResize" class="space-y-4">
              <!-- Resolution Presets -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resolution Presets
                </label>
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <button
                    v-for="preset in resolutionPresets"
                    :key="`${preset.width}x${preset.height}`"
                    @click="applyResolutionPreset(preset)"
                    class="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded transition-colors"
                    :class="{ 'ring-2 ring-blue-500': newWidth === preset.width && newHeight === preset.height }"
                    :disabled="!selectedImage"
                  >
                    {{ preset.name }}<br>
                    <span class="text-gray-500 dark:text-gray-400">{{ preset.width }}×{{ preset.height }}</span>
                  </button>
                </div>
              </div>

              <!-- Scale by Percentage -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scale by Percentage
                </label>
                <div class="flex items-center space-x-2">
                  <input
                    v-model.number="scalePercentage"
                    type="number"
                    min="1"
                    max="500"
                    step="1"
                    class="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    :disabled="!selectedImage"
                  />
                  <span class="text-sm text-gray-600 dark:text-gray-300">%</span>
                  <button
                    @click="applyScalePercentage"
                    class="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded transition-colors"
                    :disabled="!selectedImage"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <!-- Custom Dimensions -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Dimensions
                </label>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Width (px)
                    </label>
                    <input
                      v-model.number="newWidth"
                      type="number"
                      min="1"
                      max="4000"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                      :placeholder="selectedImage ? originalDimensions.width.toString() : '1920'"
                      :disabled="!selectedImage"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Height (px)
                    </label>
                    <input
                      v-model.number="newHeight"
                      type="number"
                      min="1"
                      max="4000"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                      :placeholder="selectedImage ? originalDimensions.height.toString() : '1080'"
                      :disabled="!selectedImage"
                    />
                  </div>
                </div>
              </div>

              <!-- Aspect Ratio Options -->
              <div class="space-y-2">
                <label class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <input
                    v-model="maintainAspectRatio"
                    type="checkbox"
                    class="mr-2 text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600"
                    :disabled="!selectedImage"
                  />
                  Maintain aspect ratio
                </label>
                
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  <span v-if="selectedImage">
                    Current ratio: {{ currentAspectRatio }}
                    <span v-if="newWidth && newHeight">
                      → New ratio: {{ newAspectRatio }}
                    </span>
                  </span>
                  <span v-else>
                    Upload an image to see aspect ratio information
                  </span>
                </div>
              </div>
            </div>

            <!-- Convert Button -->
            <button
              @click="convertImage"
              :disabled="isConverting || !selectedImage"
              class="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              {{ isConverting ? 'Converting...' : !selectedImage ? 'Upload image to convert' : 'Convert Image' }}
            </button>
          </div>
        </div>

        <!-- Image Preview -->
        <div v-if="imagePreview" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-center">
            <img
              :src="imagePreview"
              alt="Preview"
              class="max-w-full max-h-64 mx-auto rounded"
            />
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Original: {{ originalDimensions.width }}×{{ originalDimensions.height }}px
            </p>
          </div>
        </div>

        <!-- Feature Overview -->
        <div v-if="!imagePreview" class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
          <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            What You Can Do
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
              <h4 class="font-medium text-blue-800 dark:text-blue-300">Format Conversion</h4>
              <ul class="space-y-1 text-blue-700 dark:text-blue-400">
                <li>• Convert between JPEG, PNG, WebP</li>
                <li>• Adjust quality for compressed formats</li>
                <li>• Optimize file size vs quality</li>
              </ul>
            </div>
            <div class="space-y-2">
              <h4 class="font-medium text-blue-800 dark:text-blue-300">Resize & Scale</h4>
              <ul class="space-y-1 text-blue-700 dark:text-blue-400">
                <li>• Use preset resolutions (HD, 4K, Social media)</li>
                <li>• Scale by percentage (10% - 500%)</li>
                <li>• Custom dimensions with aspect ratio</li>
              </ul>
            </div>
          </div>
          <div class="mt-4 p-3 bg-blue-100 dark:bg-blue-800/30 rounded text-blue-800 dark:text-blue-300 text-sm">
            <strong>Getting Started:</strong> Upload an image above to see live preview and access all conversion options.
          </div>
        </div>

        <!-- Converted Image -->
        <div v-if="convertedImage" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Converted Image</h3>
            <button
              @click="downloadImage"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
            >
              Download
            </button>
          </div>
          
          <div class="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-center">
            <img
              :src="convertedImage"
              alt="Converted"
              class="max-w-full max-h-64 mx-auto rounded"
            />
            <div class="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>Format: {{ outputFormat.toUpperCase() }}</p>
              <p v-if="convertedDimensions.width">
                Size: {{ convertedDimensions.width }}×{{ convertedDimensions.height }}px
              </p>
              <p v-if="convertedFileSize">
                File size: {{ formatFileSize(convertedFileSize) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Status Messages -->
        <div v-if="statusMessage" class="fixed bottom-4 right-4 z-50">
          <div
            class="px-4 py-2 rounded shadow-lg"
            :class="{
              'bg-green-500 text-white': statusMessage.type === 'success',
              'bg-red-500 text-white': statusMessage.type === 'error',
              'bg-blue-500 text-white': statusMessage.type === 'info'
            }"
          >
            {{ statusMessage.text }}
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

// Initialize theme on client-side
onMounted(() => {
  initializeTheme()
})

// Reactive data
const selectedImage = ref<File | null>(null)
const imagePreview = ref<string>('')
const isDragging = ref(false)
const isConverting = ref(false)

// Image dimensions
const originalDimensions = ref({ width: 0, height: 0 })
const convertedDimensions = ref({ width: 0, height: 0 })

// Conversion settings
const outputFormat = ref<'jpeg' | 'png' | 'webp'>('jpeg')
const quality = ref(90)
const enableResize = ref(false)
const newWidth = ref<number | null>(null)
const newHeight = ref<number | null>(null)
const maintainAspectRatio = ref(true)
const scalePercentage = ref(100)

// Resolution presets
const resolutionPresets = ref([
  { name: 'HD', width: 1280, height: 720 },
  { name: 'Full HD', width: 1920, height: 1080 },
  { name: '4K UHD', width: 3840, height: 2160 },
  { name: 'Instagram', width: 1080, height: 1080 },
  { name: 'Facebook', width: 1200, height: 630 },
  { name: 'Twitter', width: 1024, height: 512 },
  { name: 'YouTube', width: 1280, height: 720 },
  { name: 'Web Small', width: 800, height: 600 }
])

// Converted image
const convertedImage = ref<string>('')
const convertedFileSize = ref<number>(0)

// Status messages
const statusMessage = ref<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

// File handling
const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    processFile(target.files[0])
  }
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    showStatus('error', 'Please select a valid image file')
    return
  }

  selectedImage.value = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
    loadImageDimensions(imagePreview.value)
  }
  reader.readAsDataURL(file)
  
  // Clear previous conversion
  convertedImage.value = ''
  convertedDimensions.value = { width: 0, height: 0 }
}

const loadImageDimensions = (src: string) => {
  const img = new Image()
  img.onload = () => {
    originalDimensions.value = { width: img.width, height: img.height }
    newWidth.value = img.width
    newHeight.value = img.height
  }
  img.src = src
}

const clearImage = () => {
  selectedImage.value = null
  imagePreview.value = ''
  convertedImage.value = ''
  originalDimensions.value = { width: 0, height: 0 }
  convertedDimensions.value = { width: 0, height: 0 }
}

// Computed properties for aspect ratios
const currentAspectRatio = computed(() => {
  if (originalDimensions.value.width === 0 || originalDimensions.value.height === 0) return '0:0'
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
  const divisor = gcd(originalDimensions.value.width, originalDimensions.value.height)
  return `${originalDimensions.value.width / divisor}:${originalDimensions.value.height / divisor}`
})

const newAspectRatio = computed(() => {
  if (!newWidth.value || !newHeight.value) return '0:0'
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
  const divisor = gcd(newWidth.value, newHeight.value)
  return `${newWidth.value / divisor}:${newHeight.value / divisor}`
})

// Resolution preset functions
const applyResolutionPreset = (preset: { width: number; height: number }) => {
  newWidth.value = preset.width
  newHeight.value = preset.height
  maintainAspectRatio.value = false
}

const applyScalePercentage = () => {
  if (originalDimensions.value.width > 0 && originalDimensions.value.height > 0) {
    const scale = scalePercentage.value / 100
    newWidth.value = Math.round(originalDimensions.value.width * scale)
    newHeight.value = Math.round(originalDimensions.value.height * scale)
  }
}

// Watch for aspect ratio maintenance
watch([newWidth, newHeight, maintainAspectRatio], () => {
  if (maintainAspectRatio.value && originalDimensions.value.width > 0) {
    const aspectRatio = originalDimensions.value.width / originalDimensions.value.height
    
    if (newWidth.value && newWidth.value !== originalDimensions.value.width) {
      newHeight.value = Math.round(newWidth.value / aspectRatio)
    } else if (newHeight.value && newHeight.value !== originalDimensions.value.height) {
      newWidth.value = Math.round(newHeight.value * aspectRatio)
    }
  }
})

// Image conversion
const convertImage = async () => {
  if (!selectedImage.value || !imagePreview.value) return
  
  isConverting.value = true
  
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')
    
    const img = new Image()
    
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = imagePreview.value
    })
    
    // Set canvas dimensions
    const targetWidth = enableResize.value && newWidth.value ? newWidth.value : img.width
    const targetHeight = enableResize.value && newHeight.value ? newHeight.value : img.height
    
    canvas.width = targetWidth
    canvas.height = targetHeight
    
    // Draw image
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
    
    // Convert to desired format
    const mimeType = `image/${outputFormat.value}`
    const qualityValue = (outputFormat.value === 'jpeg' || outputFormat.value === 'webp') 
      ? quality.value / 100 
      : undefined
    
    const dataUrl = canvas.toDataURL(mimeType, qualityValue)
    convertedImage.value = dataUrl
    convertedDimensions.value = { width: targetWidth, height: targetHeight }
    
    // Calculate file size
    const byteString = atob(dataUrl.split(',')[1])
    convertedFileSize.value = byteString.length
    
    showStatus('success', 'Image converted successfully!')
    
  } catch (error) {
    console.error('Conversion error:', error)
    showStatus('error', 'Failed to convert image')
  } finally {
    isConverting.value = false
  }
}

// Download converted image
const downloadImage = () => {
  if (!convertedImage.value || !selectedImage.value) return
  
  const link = document.createElement('a')
  const fileName = selectedImage.value.name.replace(/\.[^/.]+$/, '') + '.' + outputFormat.value
  
  link.href = convertedImage.value
  link.download = fileName
  link.click()
  
  showStatus('success', 'Image downloaded!')
}

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const showStatus = (type: 'success' | 'error' | 'info', text: string) => {
  statusMessage.value = { type, text }
  setTimeout(() => {
    statusMessage.value = null
  }, 3000)
}
</script>