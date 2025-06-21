<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">JSON/YAML Converter</h1>
        <p class="text-gray-600">Convert between JSON, YAML, and TOML formats with validation and formatting</p>
      </header>

      <div class="max-w-7xl mx-auto">
        <!-- Format Selection -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Conversion Settings</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Input Format</label>
              <select 
                v-model="inputFormat"
                @change="handleFormatChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="toml">TOML</option>
              </select>
            </div>
            
            <div class="flex items-center justify-center">
              <button
                @click="swapFormats"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
                Swap
              </button>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
              <select 
                v-model="outputFormat"
                @change="handleFormatChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="toml">TOML</option>
              </select>
            </div>
          </div>
          
          <!-- Formatting Options -->
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center">
              <input
                v-model="prettyFormat"
                @change="handleFormatChange"
                type="checkbox"
                id="prettyFormat"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label for="prettyFormat" class="ml-2 text-sm text-gray-700">Pretty format output</label>
            </div>
            
            <div v-if="outputFormat === 'json'" class="flex items-center">
              <label class="text-sm text-gray-700 mr-2">Indent size:</label>
              <select 
                v-model="jsonIndent"
                @change="handleFormatChange"
                class="px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="tab">Tab</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Conversion Area -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Input -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                Input ({{ inputFormat.toUpperCase() }})
              </h3>
              <div class="flex gap-2">
                <button
                  @click="loadSample"
                  class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Load Sample
                </button>
                <button
                  @click="clearInput"
                  class="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <textarea
              v-model="inputText"
              @input="handleInputChange"
              placeholder="Paste your data here..."
              class="w-full h-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            ></textarea>
            
            <!-- Input validation status -->
            <div v-if="inputError" class="mt-2 text-red-600 text-sm">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ inputError }}</span>
              </div>
            </div>
            
            <div v-else-if="inputText && !outputText" class="mt-2 text-green-600 text-sm">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Valid {{ inputFormat.toUpperCase() }}</span>
              </div>
            </div>
          </div>

          <!-- Output -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                Output ({{ outputFormat.toUpperCase() }})
              </h3>
              <div class="flex gap-2">
                <button
                  v-if="outputText"
                  @click="copyOutput"
                  class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  {{ copyButtonText }}
                </button>
                <button
                  v-if="outputText"
                  @click="downloadOutput"
                  class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download
                </button>
              </div>
            </div>
            
            <textarea
              v-model="outputText"
              readonly
              placeholder="Converted output will appear here..."
              class="w-full h-80 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-none"
            ></textarea>
            
            <!-- Conversion status -->
            <div v-if="conversionError" class="mt-2 text-red-600 text-sm">
              <div class="flex items-start gap-2">
                <svg class="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ conversionError }}</span>
              </div>
            </div>
            
            <div v-else-if="outputText" class="mt-2 text-green-600 text-sm">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Successfully converted to {{ outputFormat.toUpperCase() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Format Information -->
        <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Supported Formats
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-800">
            <div>
              <h4 class="font-medium mb-2">JSON</h4>
              <p class="text-sm">JavaScript Object Notation - lightweight data interchange format</p>
            </div>
            <div>
              <h4 class="font-medium mb-2">YAML</h4>
              <p class="text-sm">YAML Ain't Markup Language - human-readable data serialization</p>
            </div>
            <div>
              <h4 class="font-medium mb-2">TOML</h4>
              <p class="text-sm">Tom's Obvious, Minimal Language - configuration file format</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import yaml from 'js-yaml'
import toml from 'toml'

// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

const inputFormat = ref('json')
const outputFormat = ref('yaml')
const inputText = ref('')
const outputText = ref('')
const prettyFormat = ref(true)
const jsonIndent = ref('2')

const inputError = ref('')
const conversionError = ref('')
const copyButtonText = ref('Copy')

// Sample data for each format
const sampleData = {
  json: `{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "active": true
}`,
  yaml: `name: John Doe
age: 30
email: john.doe@example.com
address:
  street: 123 Main St
  city: New York
  country: USA
hobbies:
  - reading
  - swimming
  - coding
active: true`,
  toml: `name = "John Doe"
age = 30
email = "john.doe@example.com"
active = true
hobbies = ["reading", "swimming", "coding"]

[address]
street = "123 Main St"
city = "New York"
country = "USA"`
}

const parseInput = () => {
  if (!inputText.value.trim()) {
    inputError.value = ''
    return null
  }

  try {
    switch (inputFormat.value) {
      case 'json':
        return JSON.parse(inputText.value)
      case 'yaml':
        return yaml.load(inputText.value)
      case 'toml':
        return toml.parse(inputText.value)
      default:
        throw new Error('Unsupported input format')
    }
  } catch (error) {
    inputError.value = `Invalid ${inputFormat.value.toUpperCase()}: ${error.message}`
    return null
  }
}

const formatOutput = (data: any) => {
  try {
    switch (outputFormat.value) {
      case 'json':
        const indentValue = jsonIndent.value === 'tab' ? '\t' : parseInt(jsonIndent.value)
        return prettyFormat.value 
          ? JSON.stringify(data, null, indentValue)
          : JSON.stringify(data)
      case 'yaml':
        return yaml.dump(data, {
          indent: 2,
          lineWidth: -1,
          noRefs: true,
          sortKeys: false
        })
      case 'toml':
        // Simple TOML stringification (basic implementation)
        return stringifyToml(data)
      default:
        throw new Error('Unsupported output format')
    }
  } catch (error) {
    conversionError.value = `Conversion error: ${error.message}`
    return ''
  }
}

// Basic TOML stringifier
const stringifyToml = (obj: any, prefix = ''): string => {
  let result = ''
  const tables: { [key: string]: any } = {}
  
  // Handle primitive values first
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      tables[key] = value
    } else {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (Array.isArray(value)) {
        result += `${key} = ${JSON.stringify(value)}\n`
      } else if (typeof value === 'string') {
        result += `${key} = "${value}"\n`
      } else {
        result += `${key} = ${value}\n`
      }
    }
  }
  
  // Handle nested objects as tables
  for (const [key, value] of Object.entries(tables)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    result += `\n[${fullKey}]\n`
    result += stringifyToml(value, fullKey)
  }
  
  return result
}

const convertData = () => {
  inputError.value = ''
  conversionError.value = ''
  
  if (!inputText.value.trim()) {
    outputText.value = ''
    return
  }

  const parsedData = parseInput()
  if (parsedData === null) {
    outputText.value = ''
    return
  }

  const formattedOutput = formatOutput(parsedData)
  outputText.value = formattedOutput
}

const handleInputChange = () => {
  convertData()
}

const handleFormatChange = () => {
  convertData()
}

const swapFormats = () => {
  const temp = inputFormat.value
  inputFormat.value = outputFormat.value
  outputFormat.value = temp
  
  // Swap the text content
  const tempText = inputText.value
  inputText.value = outputText.value
  outputText.value = tempText
  
  convertData()
}

const loadSample = () => {
  inputText.value = sampleData[inputFormat.value as keyof typeof sampleData]
  convertData()
}

const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
  inputError.value = ''
  conversionError.value = ''
}

const copyOutput = async () => {
  if (!outputText.value) return
  
  try {
    await navigator.clipboard.writeText(outputText.value)
    copyButtonText.value = 'Copied!'
    setTimeout(() => {
      copyButtonText.value = 'Copy'
    }, 2000)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const downloadOutput = () => {
  if (!outputText.value) return
  
  const blob = new Blob([outputText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `converted-data.${outputFormat.value}`
  link.click()
  URL.revokeObjectURL(url)
}

// Watch for format changes to clear errors
watch([inputFormat, outputFormat], () => {
  inputError.value = ''
  conversionError.value = ''
})
</script>