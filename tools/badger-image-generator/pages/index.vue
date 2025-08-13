<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white shadow-xl rounded-lg">
        <div class="px-6 py-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Badger2040 Image Generator</h1>
          <p class="text-gray-600 mb-8">Generate 296x128 pixel monochrome images for your Badger2040 display</p>
          
          <div class="space-y-6">
            <!-- Text Input -->
            <div>
              <label for="text" class="block text-sm font-medium text-gray-700 mb-2">
                Enter Text
              </label>
              <textarea
                v-model="inputText"
                id="text"
                rows="3"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3"
                placeholder="Enter the text to display on your Badger2040..."
              ></textarea>
            </div>

            <!-- Font Size -->
            <div>
              <label for="fontSize" class="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <input
                v-model.number="fontSize"
                type="range"
                id="fontSize"
                min="8"
                max="72"
                class="w-full"
              />
              <span class="text-sm text-gray-500">{{ fontSize }}px</span>
            </div>

            <!-- Text Position -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="textX" class="block text-sm font-medium text-gray-700 mb-2">
                  X Position
                </label>
                <input
                  v-model.number="textX"
                  type="number"
                  id="textX"
                  min="0"
                  max="296"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label for="textY" class="block text-sm font-medium text-gray-700 mb-2">
                  Y Position
                </label>
                <input
                  v-model.number="textY"
                  type="number"
                  id="textY"
                  min="0"
                  max="128"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            <!-- Alignment -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Text Alignment
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  @click="textAlign = 'left'"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium',
                    textAlign === 'left' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                >
                  Left
                </button>
                <button
                  @click="textAlign = 'center'"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium',
                    textAlign === 'center' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]"
                >
                  Center
                </button>
                <button
                  @click="textAlign = 'right'"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium',
                    textAlign === 'right' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                type="checkbox"
                id="invert"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="invert" class="ml-2 block text-sm text-gray-900">
                Invert colors (white text on black background)
              </label>
            </div>

            <!-- Generate Button -->
            <div>
              <button
                @click="generateImage"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate Image
              </button>
            </div>
          </div>

          <!-- Preview -->
          <div v-if="imageUrl" class="mt-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
            <div class="border-4 border-gray-800 inline-block bg-gray-200 p-2">
              <img 
                :src="imageUrl" 
                alt="Generated Badger2040 image"
                class="pixelated"
                style="width: 592px; height: 256px; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;"
              />
            </div>
            <p class="text-xs text-gray-500 mt-2">Actual size: 296x128 pixels (shown at 2x scale)</p>
            
            <!-- Download Button -->
            <div class="mt-4 space-x-4">
              <a
                :href="imageUrl"
                :download="`badger-image-${Date.now()}.png`"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg class="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PNG
              </a>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const inputText = ref('Hello\nBadger2040!')
const fontSize = ref(24)
const textX = ref(148)
const textY = ref(64)
const textAlign = ref('center')
const invertColors = ref(false)
const imageUrl = ref('')
const canvas = ref(null)

const BADGER_WIDTH = 296
const BADGER_HEIGHT = 128

onMounted(() => {
  canvas.value = document.createElement('canvas')
  canvas.value.width = BADGER_WIDTH
  canvas.value.height = BADGER_HEIGHT
})

const generateImage = () => {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  
  // Clear canvas with background color
  ctx.fillStyle = invertColors.value ? '#000000' : '#FFFFFF'
  ctx.fillRect(0, 0, BADGER_WIDTH, BADGER_HEIGHT)
  
  // Set text properties
  ctx.fillStyle = invertColors.value ? '#FFFFFF' : '#000000'
  ctx.font = `${fontSize.value}px monospace`
  ctx.textAlign = textAlign.value
  ctx.textBaseline = 'middle'
  
  // Draw text (handle multi-line)
  const lines = inputText.value.split('\n')
  const lineHeight = fontSize.value * 1.2
  const startY = textY.value - ((lines.length - 1) * lineHeight) / 2
  
  lines.forEach((line, index) => {
    ctx.fillText(line, textX.value, startY + (index * lineHeight))
  })
  
  // Convert to data URL
  imageUrl.value = canvas.value.toDataURL('image/png')
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

// Generate initial image
onMounted(() => {
  setTimeout(generateImage, 100)
})
</script>

<style scoped>
.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>