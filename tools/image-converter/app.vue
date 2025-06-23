<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8 relative">
        <div class="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Image Converter</h1>
        <p class="text-gray-600 dark:text-gray-300">Convert image formats and resize images online</p>
      </header>

      <div class="max-w-4xl mx-auto space-y-6">
        <!-- File Upload Area -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Image</h2>
            
            <div
              @drop="onDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center transition-colors"
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

        <!-- Image Preview and Settings -->
        <div v-if="imagePreview" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Preview -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
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

          <!-- Conversion Settings -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
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
                  class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
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

              <div v-if="enableResize" class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Width (px)
                  </label>
                  <input
                    v-model.number="newWidth"
                    type="number"
                    min="1"
                    max="4000"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    :placeholder="originalDimensions.width.toString()"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Height (px)
                  </label>
                  <input
                    v-model.number="newHeight"
                    type="number"
                    min="1"
                    max="4000"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    :placeholder="originalDimensions.height.toString()"
                  />
                </div>
              </div>

              <div v-if="enableResize">
                <label class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <input
                    v-model="maintainAspectRatio"
                    type="checkbox"
                    class="mr-2 text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                  Maintain aspect ratio
                </label>
              </div>

              <!-- Convert Button -->
              <button
                @click="convertImage"
                :disabled="isConverting"
                class="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
              >
                {{ isConverting ? 'Converting...' : 'Convert Image' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Converted Image -->
        <div v-if="convertedImage" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Converted Image</h3>
            <button
              @click="downloadImage"
              class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
            >
              Download
            </button>
          </div>
          
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
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