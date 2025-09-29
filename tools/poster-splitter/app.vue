<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <!-- Header -->
      <header class="mb-8">
        <div class="flex justify-between items-center">
          <h1 class="text-4xl font-bold mb-2">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              📐 Poster Splitter
            </span>
          </h1>
          <button
            @click="toggleTheme"
            class="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            :title="`Current theme: ${getThemeName()}`"
          >
            <span class="text-2xl">{{ getThemeIcon() }}</span>
          </button>
        </div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Split A3 images and PDFs into A4 pages for easy printing
        </p>
      </header>

      <!-- Main Content -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Upload Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Upload File
          </h2>
          
          <div
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          >
            <input
              ref="fileInput"
              type="file"
              @change="handleFileSelect"
              accept=".pdf,.png,.jpg,.jpeg"
              class="hidden"
            >
            
            <div v-if="!uploadedFile" class="space-y-4">
              <div class="text-5xl text-gray-400">📁</div>
              <p class="text-gray-600 dark:text-gray-400">
                Drag & drop your A3 file here or
              </p>
              <button
                @click="$refs.fileInput.click()"
                class="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Browse Files
              </button>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Supported formats: PDF, PNG, JPG
              </p>
            </div>
            
            <div v-else class="space-y-4">
              <div class="text-5xl text-green-500">✅</div>
              <p class="text-gray-700 dark:text-gray-300 font-medium">
                {{ uploadedFile.name }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Size: {{ formatFileSize(uploadedFile.size) }}
              </p>
              <button
                @click="clearFile"
                class="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Remove File
              </button>
            </div>
          </div>

          <!-- Split Options -->
          <div v-if="uploadedFile" class="mt-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Format
              </label>
              <select
                v-model="outputFormat"
                @change="splitFile"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Split Direction
              </label>
              <select
                v-model="splitDirection"
                @change="splitFile"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="horizontal">Horizontal (Left & Right)</option>
                <option value="vertical">Vertical (Top & Bottom)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rotation
              </label>
              <select
                v-model="rotation"
                @change="splitFile"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="0">No rotation (0°)</option>
                <option value="90">Rotate 90° clockwise</option>
                <option value="180">Rotate 180°</option>
                <option value="270">Rotate 270° clockwise (90° counter-clockwise)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Overlap (mm)
              </label>
              <input
                v-model.number="overlap"
                @change="splitFile"
                type="number"
                min="0"
                max="50"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Adds overlap area for easier alignment when joining pages
              </p>
            </div>

            <div v-if="processing" class="text-center py-3">
              <span class="text-gray-600 dark:text-gray-400">Processing...</span>
            </div>
          </div>
        </div>

        <!-- Preview & Download Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Preview & Download
          </h2>

          <div v-if="!splitPages.length" class="text-center py-12">
            <div class="text-5xl text-gray-400 mb-4">📄</div>
            <p class="text-gray-500 dark:text-gray-400">
              Split pages will appear here
            </p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="(page, index) in splitPages" :key="index" class="border border-gray-300 dark:border-gray-600 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-medium text-gray-700 dark:text-gray-300">
                  Page {{ index + 1 }} (A4)
                </h3>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ splitDirection === 'horizontal' ? (index === 0 ? 'Left' : 'Right') : (index === 0 ? 'Top' : 'Bottom') }}
                </span>
              </div>
              
              <div class="aspect-[210/297] bg-gray-100 dark:bg-gray-700 rounded mb-3 flex items-center justify-center overflow-hidden">
                <img
                  v-if="page.preview"
                  :src="page.preview"
                  :alt="`Page ${index + 1}`"
                  class="max-w-full max-h-full object-contain"
                >
                <div v-else class="text-gray-400">
                  <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>

              <button
                @click="downloadPage(page, index)"
                class="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                Download Page {{ index + 1 }}
              </button>
            </div>

            <button
              @click="downloadAll"
              class="w-full px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
            >
              Download All Pages
            </button>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          📖 How to Use
        </h2>
        <ol class="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Upload your A3-sized image or PDF file</li>
          <li>Choose the output format (PNG, JPG, or PDF)</li>
          <li>Select split direction (horizontal or vertical)</li>
          <li>Set rotation angle (0°, 90°, 180°, or 270°) if needed</li>
          <li>Optionally add overlap for easier alignment when joining printed pages</li>
          <li>Click "Split File" to process</li>
          <li>Download individual A4 pages or all pages at once</li>
          <li>Print each A4 page and join them together to create your A3 poster</li>
        </ol>

        <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <p class="text-sm text-blue-800 dark:text-blue-300">
            <strong>Tip:</strong> Adding a small overlap (5-10mm) makes it easier to align and tape the pages together accurately.
          </p>
        </div>
      </div>
    </div>
  </div>

    <!-- Universal Support Me Button -->
    <KofiButton kofi-username="kterr" />

    <!-- Footer -->
    <footer class="mt-20 text-center text-gray-500 dark:text-gray-400">
      <p>
        &copy; 2025 DevTools. Built with Nuxt 3 and deployed on AWS.
        <span class="mx-2">|</span>
        <a
          href="https://www.tomohiko.io/legal-disclosure"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors"
        >
          特定商取引法に基づく表記
        </a>
      </p>
    </footer>
</template>

<script setup lang="ts">
import KofiButton from '../shared/components/KofiButton.vue'
import { ref, onMounted, nextTick, watch } from 'vue'
import { useDarkMode } from './composables/useDarkMode'

// Dark mode setup
const { initializeTheme, toggleTheme, getThemeIcon, getThemeName } = useDarkMode()

onMounted(() => {
  initializeTheme()
})

// File handling
const fileInput = ref<HTMLInputElement>()
const uploadedFile = ref<File | null>(null)
const outputFormat = ref<'png' | 'jpg' | 'pdf'>('png')
const splitDirection = ref<'horizontal' | 'vertical'>('horizontal')
const rotation = ref<0 | 90 | 180 | 270>(0)
const overlap = ref(10) // mm
const processing = ref(false)
const splitPages = ref<Array<{
  data: Blob
  preview: string | null
}>>([])

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (validateFile(file)) {
      uploadedFile.value = file
      // Auto-split the file when uploaded
      nextTick(() => splitFile())
    }
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    const file = files[0]
    if (validateFile(file)) {
      uploadedFile.value = file
      // Auto-split the file when uploaded
      nextTick(() => splitFile())
    }
  }
}

const validateFile = (file: File): boolean => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
  if (!validTypes.includes(file.type)) {
    alert('Please upload a PNG, JPG, or PDF file')
    return false
  }
  if (file.size > 50 * 1024 * 1024) { // 50MB limit
    alert('File size must be less than 50MB')
    return false
  }
  return true
}

const clearFile = () => {
  uploadedFile.value = null
  splitPages.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  processing.value = false
}

const splitFile = async () => {
  if (!uploadedFile.value) return
  
  processing.value = true
  splitPages.value = []
  
  try {
    const file = uploadedFile.value
    
    if (file.type === 'application/pdf') {
      await splitPDF(file)
    } else {
      await splitImage(file)
    }
  } catch (error) {
    console.error('Error splitting file:', error)
    alert('Error processing file. Please try again.')
  } finally {
    processing.value = false
  }
}

const splitImage = async (file: File) => {
  const img = new Image()
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Cannot get canvas context')
  }
  
  return new Promise<void>((resolve, reject) => {
    img.onload = () => {
      // A3 dimensions in pixels at 96 DPI
      const a3Width = 1123 // 297mm
      const a3Height = 1587 // 420mm
      const a4Width = 794 // 210mm
      const a4Height = 1123 // 297mm
      
      // Create a temporary canvas for rotation if needed
      let sourceImg = img
      if (rotation.value !== 0) {
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        if (!tempCtx) throw new Error('Cannot get temp canvas context')
        
        // Calculate rotated dimensions
        const angle = (rotation.value * Math.PI) / 180
        const cos = Math.abs(Math.cos(angle))
        const sin = Math.abs(Math.sin(angle))
        tempCanvas.width = img.width * cos + img.height * sin
        tempCanvas.height = img.width * sin + img.height * cos
        
        // Apply rotation
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2)
        tempCtx.rotate(angle)
        tempCtx.drawImage(img, -img.width / 2, -img.height / 2)
        
        // Create new image from rotated canvas
        sourceImg = new Image()
        sourceImg.src = tempCanvas.toDataURL()
        
        // Wait for rotated image to load
        sourceImg.onload = () => processRotatedImage()
        return
      } else {
        processRotatedImage()
      }
      
      function processRotatedImage() {
        // Calculate scale to fit A3
        const scaleX = a3Width / sourceImg.width
        const scaleY = a3Height / sourceImg.height
        const scale = Math.min(scaleX, scaleY)
        
        const scaledWidth = sourceImg.width * scale
        const scaledHeight = sourceImg.height * scale
        
        // Calculate overlap in pixels
        const overlapPx = (overlap.value / 297) * a4Height
      
        if (splitDirection.value === 'horizontal') {
          // Split into left and right
          const splitX = scaledWidth / 2
          
          // Left page
          canvas.width = a4Width
          canvas.height = a4Height
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(sourceImg, 0, 0, sourceImg.width / 2 + (overlapPx / scale), sourceImg.height, 
                        0, 0, a4Width, a4Height)
          
          canvas.toBlob((blob) => {
            if (blob) {
              splitPages.value.push({
                data: blob,
                preview: URL.createObjectURL(blob)
              })
            }
          }, `image/${outputFormat.value}`)
          
          // Right page
          setTimeout(() => {
            canvas.width = a4Width
            canvas.height = a4Height
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(sourceImg, sourceImg.width / 2 - (overlapPx / scale), 0, sourceImg.width / 2 + (overlapPx / scale), sourceImg.height,
                          0, 0, a4Width, a4Height)
            
            canvas.toBlob((blob) => {
              if (blob) {
                splitPages.value.push({
                  data: blob,
                  preview: URL.createObjectURL(blob)
                })
                resolve()
              }
            }, `image/${outputFormat.value}`)
          }, 100)
        } else {
          // Split into top and bottom
          const splitY = scaledHeight / 2
          
          // Top page
          canvas.width = a4Height
          canvas.height = a4Width
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(sourceImg, 0, 0, sourceImg.width, sourceImg.height / 2 + (overlapPx / scale),
                        0, 0, a4Height, a4Width)
          
          canvas.toBlob((blob) => {
            if (blob) {
              splitPages.value.push({
                data: blob,
                preview: URL.createObjectURL(blob)
              })
            }
          }, `image/${outputFormat.value}`)
          
          // Bottom page
          setTimeout(() => {
            canvas.width = a4Height
            canvas.height = a4Width
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(sourceImg, 0, sourceImg.height / 2 - (overlapPx / scale), sourceImg.width, sourceImg.height / 2 + (overlapPx / scale),
                          0, 0, a4Height, a4Width)
            
            canvas.toBlob((blob) => {
              if (blob) {
                splitPages.value.push({
                  data: blob,
                  preview: URL.createObjectURL(blob)
                })
                resolve()
              }
            }, `image/${outputFormat.value}`)
          }, 100)
        }
      }
    }
    
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

const splitPDF = async (file: File) => {
  // For PDF splitting, we'll use a simplified approach
  // In a production environment, you'd use pdf.js or similar library
  alert('PDF splitting will be implemented with pdf.js library. For now, please convert your PDF to an image first.')
}

const downloadPage = (page: { data: Blob }, index: number) => {
  const url = URL.createObjectURL(page.data)
  const a = document.createElement('a')
  a.href = url
  a.download = `page_${index + 1}.${outputFormat.value}`
  a.click()
  URL.revokeObjectURL(url)
}

const downloadAll = () => {
  splitPages.value.forEach((page, index) => {
    setTimeout(() => {
      downloadPage(page, index)
    }, index * 500) // Delay to prevent browser blocking
  })
}
</script>