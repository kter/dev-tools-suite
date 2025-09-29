<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <div class="bg-white dark:bg-gray-800 shadow-xl rounded-xl">
        <div class="px-6 py-8">
          <h1 class="text-4xl font-bold mb-2">
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Badger2040 Image Generator
            </span>
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mb-8">Generate 296x128 pixel monochrome images for your Badger2040 display</p>
          
          <div class="space-y-6">
            <!-- Text Input -->
            <div>
              <label for="text" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Text
              </label>
              <textarea
                v-model="inputText"
                @input="generateImage"
                id="text"
                rows="3"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:text-gray-100"
                placeholder="Enter the text to display on your Badger2040..."
              ></textarea>
            </div>

            <!-- Font Settings -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Font Size -->
              <div>
                <label for="fontSize" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size: {{ fontSize }}px
                </label>
                <input
                  v-model.number="fontSize"
                  @input="generateImage"
                  type="range"
                  id="fontSize"
                  min="8"
                  max="72"
                  class="w-full"
                />
              </div>

              <!-- Font Weight -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Weight
                </label>
                <div class="flex space-x-2">
                  <button
                    @click="fontBold = false; generateImage()"
                    :class="[
                      'flex-1 px-3 py-2 rounded-md text-sm font-medium',
                      !fontBold 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                    ]"
                  >
                    Normal
                  </button>
                  <button
                    @click="fontBold = true; generateImage()"
                    :class="[
                      'flex-1 px-3 py-2 rounded-md text-sm font-medium',
                      fontBold 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                    ]"
                  >
                    Bold
                  </button>
                </div>
              </div>
            </div>

            <!-- Text Position -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="textX" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  X Position
                </label>
                <input
                  v-model.number="textX"
                  @input="generateImage"
                  type="number"
                  id="textX"
                  min="0"
                  max="296"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:text-gray-100"
                />
              </div>
              <div>
                <label for="textY" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Y Position
                </label>
                <input
                  v-model.number="textY"
                  @input="generateImage"
                  type="number"
                  id="textY"
                  min="0"
                  max="128"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 dark:text-gray-100"
                />
              </div>
            </div>

            <!-- Alignment -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text Alignment
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  @click="textAlign = 'left'; generateImage()"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium',
                    textAlign === 'left' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                  ]"
                >
                  Left
                </button>
                <button
                  @click="textAlign = 'center'; generateImage()"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium',
                    textAlign === 'center' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                  ]"
                >
                  Center
                </button>
                <button
                  @click="textAlign = 'right'; generateImage()"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium',
                    textAlign === 'right' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                  ]"
                >
                  Right
                </button>
              </div>
            </div>

            <!-- Invert Colors -->
            <div class="flex items-center">
              <input
                v-model="invertColors"
                @change="generateImage"
                type="checkbox"
                id="invert"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label for="invert" class="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                Invert colors (white text on black background)
              </label>
            </div>

            <!-- Image Quality for JPG -->
            <div>
              <label for="quality" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                JPG Quality: {{ jpgQuality }}%
              </label>
              <input
                v-model.number="jpgQuality"
                @input="generateImage"
                type="range"
                id="quality"
                min="10"
                max="100"
                step="5"
                class="w-full"
              />
            </div>
          </div>

          <!-- Preview -->
          <div v-if="imageUrl" class="mt-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Preview</h2>
            <div class="border-4 border-gray-800 inline-block bg-gray-200 p-2">
              <img 
                :src="imageUrl" 
                alt="Generated Badger2040 image"
                class="pixelated"
                style="width: 592px; height: 256px; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;"
              />
            </div>
            <p class="text-xs text-gray-500 mt-2">Actual size: 296x128 pixels (shown at 2x scale)</p>
            
            <!-- Download Buttons -->
            <div class="mt-4 space-x-4">
              <button
                @click="downloadAsJPG"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg class="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download JPG
              </button>
              <button
                @click="downloadAsPNG"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <svg class="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PNG
              </button>
              <button
                @click="downloadAsPython"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Download Python Code
              </button>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const inputText = ref('Hello\nBadger2040!')
const fontSize = ref(24)
const fontBold = ref(false)
const textX = ref(148)
const textY = ref(64)
const textAlign = ref('center')
const invertColors = ref(false)
const jpgQuality = ref(90)
const imageUrl = ref('')
const jpgUrl = ref('')
const canvas = ref(null)

const BADGER_WIDTH = 296
const BADGER_HEIGHT = 128

onMounted(() => {
  canvas.value = document.createElement('canvas')
  canvas.value.width = BADGER_WIDTH
  canvas.value.height = BADGER_HEIGHT
  generateImage()
})

const generateImage = () => {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  
  // Clear canvas with background color
  ctx.fillStyle = invertColors.value ? '#000000' : '#FFFFFF'
  ctx.fillRect(0, 0, BADGER_WIDTH, BADGER_HEIGHT)
  
  // Set text properties
  ctx.fillStyle = invertColors.value ? '#FFFFFF' : '#000000'
  const fontWeight = fontBold.value ? 'bold' : 'normal'
  ctx.font = `${fontWeight} ${fontSize.value}px monospace`
  ctx.textAlign = textAlign.value
  ctx.textBaseline = 'middle'
  
  // Draw text (handle multi-line)
  const lines = inputText.value.split('\n')
  const lineHeight = fontSize.value * 1.2
  const startY = textY.value - ((lines.length - 1) * lineHeight) / 2
  
  lines.forEach((line, index) => {
    ctx.fillText(line, textX.value, startY + (index * lineHeight))
  })
  
  // Convert to data URLs
  imageUrl.value = canvas.value.toDataURL('image/png')
  jpgUrl.value = canvas.value.toDataURL('image/jpeg', jpgQuality.value / 100)
}

const downloadAsJPG = () => {
  // Create a temporary canvas with white background for JPG
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = BADGER_WIDTH
  tempCanvas.height = BADGER_HEIGHT
  const tempCtx = tempCanvas.getContext('2d')
  
  // Fill with white background (JPG doesn't support transparency)
  tempCtx.fillStyle = '#FFFFFF'
  tempCtx.fillRect(0, 0, BADGER_WIDTH, BADGER_HEIGHT)
  
  // Draw the original canvas on top
  tempCtx.drawImage(canvas.value, 0, 0)
  
  // Convert to JPG
  const jpgDataUrl = tempCanvas.toDataURL('image/jpeg', jpgQuality.value / 100)
  
  const a = document.createElement('a')
  a.href = jpgDataUrl
  a.download = `badger-image-${Date.now()}.jpg`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const downloadAsPNG = () => {
  const a = document.createElement('a')
  a.href = imageUrl.value
  a.download = `badger-image-${Date.now()}.png`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const downloadAsPython = () => {
  const pythonCode = `#!/usr/bin/env python3
# Badger2040 Display Code
# Generated image with text: "${inputText.value.replace(/\n/g, '\\n')}"

import badger2040
import time

# Initialize display
display = badger2040.Badger2040()
display.set_update_speed(badger2040.UPDATE_NORMAL)

# Clear display
display.set_pen(${invertColors.value ? '0' : '15'})  # ${invertColors.value ? 'Black' : 'White'} background
display.clear()

# Set text color
display.set_pen(${invertColors.value ? '15' : '0'})  # ${invertColors.value ? 'White' : 'Black'} text

# Set font size (scale factor)
display.set_font("bitmap8")
scale = ${Math.round(fontSize.value / 8)}
${fontBold.value ? '# Note: Bold text is simulated - Badger2040 may not support it directly' : ''}

# Draw text
text = "${inputText.value.replace(/\n/g, '\\n')}"
lines = text.split("\\n")
y_offset = ${textY.value}

for i, line in enumerate(lines):
    y_pos = y_offset + (i * ${Math.round(fontSize.value * 1.2)})
    ${textAlign.value === 'center' ? 
      `x_pos = ${BADGER_WIDTH} // 2 - (len(line) * 6 * scale) // 2` : 
      textAlign.value === 'right' ? 
      `x_pos = ${BADGER_WIDTH} - (len(line) * 6 * scale)` : 
      `x_pos = ${textX.value}`
    }
    display.text(line, x_pos, y_pos, scale=scale)

# Update the display
display.update()

# Keep the program running
while True:
    time.sleep(1)
`

  const blob = new Blob([pythonCode], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `badger_display_${Date.now()}.py`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>