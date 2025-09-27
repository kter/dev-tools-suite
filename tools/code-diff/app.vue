<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <header class="text-center mb-8">
        <div class="flex justify-between items-center mb-4">
          <div class="flex-1"></div>
          <div class="flex-1 text-center">
            <h1 class="text-4xl font-bold mb-2">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Code Diff
              </span>
            </h1>
          </div>
          <div class="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Compare and visualize differences between two text files or code snippets</p>
      </header>

      <div class="max-w-7xl mx-auto">
        <!-- Options Panel -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 transition-colors">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <label for="language" class="text-sm font-medium text-gray-700 dark:text-gray-300">Language:</label>
              <select
                id="language"
                v-model="selectedLanguage"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="plain">Plain Text</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="cpp">C++</option>
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="yaml">YAML</option>
                <option value="sql">SQL</option>
                <option value="bash">Bash</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <label for="view-mode" class="text-sm font-medium text-gray-700 dark:text-gray-300">View:</label>
              <select
                id="view-mode"
                v-model="viewMode"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="side-by-side">Side by Side</option>
                <option value="unified">Unified</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <input
                id="ignore-whitespace"
                v-model="ignoreWhitespace"
                type="checkbox"
                class="rounded text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              />
              <label for="ignore-whitespace" class="text-sm text-gray-700 dark:text-gray-300">Ignore Whitespace</label>
            </div>

            <div class="flex items-center gap-2">
              <input
                id="ignore-case"
                v-model="ignoreCase"
                type="checkbox"
                class="rounded text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              />
              <label for="ignore-case" class="text-sm text-gray-700 dark:text-gray-300">Ignore Case</label>
            </div>

            <div class="flex items-center gap-2">
              <input
                id="word-diff"
                v-model="wordDiff"
                type="checkbox"
                class="rounded text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              />
              <label for="word-diff" class="text-sm text-gray-700 dark:text-gray-300">Word-level Diff</label>
            </div>
          </div>
        </div>

        <!-- Input Areas -->
        <div v-if="viewMode === 'side-by-side'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Original Text -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors">
            <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Original</h3>
              <div class="flex gap-2">
                <button
                  @click="loadFile('original')"
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Load File
                </button>
                <button
                  @click="clearText('original')"
                  class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            <div class="p-4">
              <textarea
                v-model="originalText"
                placeholder="Enter original text or code..."
                rows="20"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm transition-colors"
              />
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Lines: {{ originalText.split('\n').length }} | Characters: {{ originalText.length }}
              </div>
            </div>
          </div>

          <!-- Modified Text -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors">
            <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Modified</h3>
              <div class="flex gap-2">
                <button
                  @click="loadFile('modified')"
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Load File
                </button>
                <button
                  @click="clearText('modified')"
                  class="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            <div class="p-4">
              <textarea
                v-model="modifiedText"
                placeholder="Enter modified text or code..."
                rows="20"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm transition-colors"
              />
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Lines: {{ modifiedText.split('\n').length }} | Characters: {{ modifiedText.length }}
              </div>
            </div>
          </div>
        </div>

        <!-- Unified Input -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-6 transition-colors">
          <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Input Files</h3>
            <div class="flex gap-2">
              <button
                @click="swapTexts"
                :disabled="!originalText || !modifiedText"
                class="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Swap
              </button>
            </div>
          </div>
          <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</label>
              <textarea
                v-model="originalText"
                placeholder="Enter original text..."
                rows="10"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Modified</label>
              <textarea
                v-model="modifiedText"
                placeholder="Enter modified text..."
                rows="10"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Diff Statistics -->
        <div v-if="diffStats" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 transition-colors">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Diff Statistics</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl transition-colors">
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ diffStats.additions }}</div>
              <div class="text-sm text-green-700 dark:text-green-300">Additions</div>
            </div>
            <div class="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl transition-colors">
              <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ diffStats.deletions }}</div>
              <div class="text-sm text-red-700 dark:text-red-300">Deletions</div>
            </div>
            <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-colors">
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ diffStats.changes }}</div>
              <div class="text-sm text-blue-700 dark:text-blue-300">Changes</div>
            </div>
            <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors">
              <div class="text-2xl font-bold text-gray-600 dark:text-gray-400">{{ diffStats.unchanged }}</div>
              <div class="text-sm text-gray-700 dark:text-gray-300">Unchanged</div>
            </div>
          </div>
        </div>

        <!-- Diff Output -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors">
          <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Diff Result</h3>
            <div class="flex gap-2">
              <button
                @click="copyDiff"
                :disabled="!diffOutput"
                class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Copy Diff
              </button>
              <button
                @click="downloadDiff"
                :disabled="!diffOutput"
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Download
              </button>
            </div>
          </div>
          <div class="p-4">
            <div v-if="!diffOutput" class="text-center text-gray-500 dark:text-gray-400 py-8">
              Enter text in both fields to see the diff
            </div>
            <div v-else>
              <div v-if="viewMode === 'side-by-side'" class="grid grid-cols-1 lg:grid-cols-2 gap-1">
                <!-- Side by Side Diff -->
                <div class="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-l transition-colors">
                  <div class="bg-red-50 dark:bg-red-900/20 px-3 py-1 border-b border-gray-200 dark:border-gray-600 text-sm font-medium text-red-800 dark:text-red-200">
                    Original
                  </div>
                  <div class="max-h-96 overflow-auto">
                    <table class="w-full font-mono text-xs">
                      <tbody>
                        <tr
                          v-for="(line, index) in sideBySideDiff.original"
                          :key="`orig-${index}`"
                          :class="getLineClass(line.type, 'original')"
                        >
                          <td class="px-2 py-1 text-gray-400 dark:text-gray-500 text-right border-r border-gray-200 dark:border-gray-600 w-12">
                            {{ line.lineNumber || '' }}
                          </td>
                          <td class="px-2 py-1 whitespace-pre-wrap break-all text-gray-900 dark:text-gray-100">{{ line.content }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-r transition-colors">
                  <div class="bg-green-50 dark:bg-green-900/20 px-3 py-1 border-b border-gray-200 dark:border-gray-600 text-sm font-medium text-green-800 dark:text-green-200">
                    Modified
                  </div>
                  <div class="max-h-96 overflow-auto">
                    <table class="w-full font-mono text-xs">
                      <tbody>
                        <tr
                          v-for="(line, index) in sideBySideDiff.modified"
                          :key="`mod-${index}`"
                          :class="getLineClass(line.type, 'modified')"
                        >
                          <td class="px-2 py-1 text-gray-400 dark:text-gray-500 text-right border-r border-gray-200 dark:border-gray-600 w-12">
                            {{ line.lineNumber || '' }}
                          </td>
                          <td class="px-2 py-1 whitespace-pre-wrap break-all text-gray-900 dark:text-gray-100">{{ line.content }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div v-else class="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded transition-colors">
                <!-- Unified Diff -->
                <div class="max-h-96 overflow-auto">
                  <table class="w-full font-mono text-xs">
                    <tbody>
                      <tr
                        v-for="(line, index) in unifiedDiff"
                        :key="`unified-${index}`"
                        :class="getUnifiedLineClass(line.type)"
                      >
                        <td class="px-2 py-1 text-gray-400 dark:text-gray-500 text-right border-r border-gray-200 dark:border-gray-600 w-12">
                          {{ line.oldLineNumber || '' }}
                        </td>
                        <td class="px-2 py-1 text-gray-400 dark:text-gray-500 text-right border-r border-gray-200 dark:border-gray-600 w-12">
                          {{ line.newLineNumber || '' }}
                        </td>
                        <td class="px-1 py-1 text-center border-r border-gray-200 dark:border-gray-600 w-6 text-gray-700 dark:text-gray-300">
                          {{ line.prefix }}
                        </td>
                        <td class="px-2 py-1 whitespace-pre-wrap break-all text-gray-900 dark:text-gray-100">{{ line.content }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Examples -->
        <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Examples</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-for="example in examples"
              :key="example.name"
              @click="loadExample(example)"
              class="p-3 text-left border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <div class="font-medium text-gray-800 dark:text-gray-200">{{ example.name }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ example.description }}</div>
            </button>
          </div>
        </div>
      </div>

      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        accept=".txt,.js,.ts,.py,.java,.cs,.cpp,.c,.css,.html,.json,.xml,.yaml,.yml,.sql,.sh,.php,.rb,.go,.rs"
        class="hidden"
        @change="handleFileLoad"
      />

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
import { useKofiWidget } from '../shared/composables/useKofiWidget'
import KOFI_CONFIG from '../shared/config/kofi'
import { diffLines, diffWordsWithSpace, Change } from 'diff'

interface DiffLine {
  content: string
  type: 'equal' | 'delete' | 'insert' | 'empty'
  lineNumber?: number
  oldLineNumber?: number
  newLineNumber?: number
  prefix?: string
}

interface DiffStats {
  additions: number
  deletions: number
  changes: number
  unchanged: number
}

interface Example {
  name: string
  description: string
  original: string
  modified: string
  language?: string
}

// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

const originalText = ref('')
const modifiedText = ref('')
const selectedLanguage = ref('javascript')
const viewMode = ref<'side-by-side' | 'unified'>('side-by-side')
const ignoreWhitespace = ref(false)
const ignoreCase = ref(false)
const wordDiff = ref(false)
const fileInput = ref<HTMLInputElement>()
const currentFileTarget = ref<'original' | 'modified'>('original')
const copyMessage = ref('')

const examples: Example[] = [
  {
    name: 'JavaScript Functions',
    description: 'Compare function implementations',
    original: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
    modified: `function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + item.price;
  }, 0);
}`,
    language: 'javascript'
  },
  {
    name: 'CSS Styles',
    description: 'Compare CSS rule changes',
    original: `.button {
  padding: 10px 20px;
  background-color: blue;
  color: white;
  border: none;
}`,
    modified: `.button {
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}`,
    language: 'css'
  },
  {
    name: 'JSON Configuration',
    description: 'Compare config file changes',
    original: `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "vue": "^3.0.0"
  }
}`,
    modified: `{
  "name": "my-app",
  "version": "1.1.0",
  "dependencies": {
    "vue": "^3.4.0",
    "axios": "^1.6.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}`,
    language: 'json'
  }
]

const processedOriginal = computed(() => {
  let text = originalText.value
  if (ignoreCase.value) text = text.toLowerCase()
  if (ignoreWhitespace.value) text = text.replace(/\s+/g, ' ').trim()
  return text
})

const processedModified = computed(() => {
  let text = modifiedText.value
  if (ignoreCase.value) text = text.toLowerCase()
  if (ignoreWhitespace.value) text = text.replace(/\s+/g, ' ').trim()
  return text
})

const diffResult = computed(() => {
  if (!processedOriginal.value && !processedModified.value) return []
  
  if (wordDiff.value) {
    return diffWordsWithSpace(processedOriginal.value, processedModified.value)
  } else {
    return diffLines(processedOriginal.value, processedModified.value)
  }
})

const diffStats = computed((): DiffStats | null => {
  if (!diffResult.value.length) return null
  
  const stats = {
    additions: 0,
    deletions: 0,
    changes: 0,
    unchanged: 0
  }
  
  diffResult.value.forEach((part: Change) => {
    const lineCount = part.value.split('\n').length - 1 || 1
    
    if (part.added) {
      stats.additions += lineCount
    } else if (part.removed) {
      stats.deletions += lineCount
    } else {
      stats.unchanged += lineCount
    }
  })
  
  stats.changes = stats.additions + stats.deletions
  
  return stats
})

const sideBySideDiff = computed(() => {
  const original: DiffLine[] = []
  const modified: DiffLine[] = []
  
  let originalLineNum = 1
  let modifiedLineNum = 1
  
  diffResult.value.forEach((part: Change) => {
    const lines = part.value.split('\n')
    if (lines[lines.length - 1] === '') lines.pop()
    
    lines.forEach((line) => {
      if (part.added) {
        original.push({ content: '', type: 'empty' })
        modified.push({
          content: line,
          type: 'insert',
          lineNumber: modifiedLineNum++
        })
      } else if (part.removed) {
        original.push({
          content: line,
          type: 'delete',
          lineNumber: originalLineNum++
        })
        modified.push({ content: '', type: 'empty' })
      } else {
        original.push({
          content: line,
          type: 'equal',
          lineNumber: originalLineNum++
        })
        modified.push({
          content: line,
          type: 'equal',
          lineNumber: modifiedLineNum++
        })
      }
    })
  })
  
  return { original, modified }
})

const unifiedDiff = computed(() => {
  const result: DiffLine[] = []
  let originalLineNum = 1
  let modifiedLineNum = 1
  
  diffResult.value.forEach((part: Change) => {
    const lines = part.value.split('\n')
    if (lines[lines.length - 1] === '') lines.pop()
    
    lines.forEach((line) => {
      if (part.added) {
        result.push({
          content: line,
          type: 'insert',
          oldLineNumber: undefined,
          newLineNumber: modifiedLineNum++,
          prefix: '+'
        })
      } else if (part.removed) {
        result.push({
          content: line,
          type: 'delete',
          oldLineNumber: originalLineNum++,
          newLineNumber: undefined,
          prefix: '-'
        })
      } else {
        result.push({
          content: line,
          type: 'equal',
          oldLineNumber: originalLineNum++,
          newLineNumber: modifiedLineNum++,
          prefix: ' '
        })
      }
    })
  })
  
  return result
})

const diffOutput = computed(() => {
  if (!diffResult.value.length) return ''
  
  if (viewMode.value === 'unified') {
    return unifiedDiff.value
      .map(line => `${line.prefix}${line.content}`)
      .join('\n')
  } else {
    return diffResult.value
      .map((part: Change) => {
        const prefix = part.added ? '+' : part.removed ? '-' : ' '
        return part.value.split('\n')
          .filter(line => line !== '')
          .map(line => `${prefix}${line}`)
          .join('\n')
      })
      .join('\n')
  }
})

const getLineClass = (type: string, side: 'original' | 'modified') => {
  const baseClass = 'border-b border-gray-100 dark:border-gray-600'
  
  switch (type) {
    case 'insert':
      return `${baseClass} bg-green-50 dark:bg-green-900/20`
    case 'delete':
      return `${baseClass} bg-red-50 dark:bg-red-900/20`
    case 'empty':
      return `${baseClass} bg-gray-50 dark:bg-gray-700`
    default:
      return baseClass
  }
}

const getUnifiedLineClass = (type: string) => {
  const baseClass = 'border-b border-gray-100 dark:border-gray-600'
  
  switch (type) {
    case 'insert':
      return `${baseClass} bg-green-50 dark:bg-green-900/20`
    case 'delete':
      return `${baseClass} bg-red-50 dark:bg-red-900/20`
    default:
      return baseClass
  }
}

const loadFile = (target: 'original' | 'modified') => {
  currentFileTarget.value = target
  fileInput.value?.click()
}

const handleFileLoad = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (currentFileTarget.value === 'original') {
      originalText.value = content
    } else {
      modifiedText.value = content
    }
    
    // Auto-detect language from file extension
    const extension = file.name.split('.').pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      py: 'python',
      java: 'java',
      cs: 'csharp',
      cpp: 'cpp',
      c: 'cpp',
      css: 'css',
      html: 'html',
      json: 'json',
      xml: 'xml',
      yaml: 'yaml',
      yml: 'yaml',
      sql: 'sql',
      sh: 'bash',
      php: 'php',
      rb: 'ruby',
      go: 'go',
      rs: 'rust'
    }
    
    if (extension && languageMap[extension]) {
      selectedLanguage.value = languageMap[extension]
    }
  }
  reader.readAsText(file)
}

const clearText = (target: 'original' | 'modified') => {
  if (target === 'original') {
    originalText.value = ''
  } else {
    modifiedText.value = ''
  }
}

const swapTexts = () => {
  const temp = originalText.value
  originalText.value = modifiedText.value
  modifiedText.value = temp
}

const copyDiff = async () => {
  if (!diffOutput.value) return
  
  try {
    await navigator.clipboard.writeText(diffOutput.value)
    showCopyMessage('Diff copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
    showCopyMessage('Failed to copy to clipboard')
  }
}

const downloadDiff = () => {
  if (!diffOutput.value) return
  
  const blob = new Blob([diffOutput.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `diff-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.diff`
  link.click()
  URL.revokeObjectURL(url)
}

const loadExample = (example: Example) => {
  originalText.value = example.original
  modifiedText.value = example.modified
  if (example.language) {
    selectedLanguage.value = example.language
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
  // Load a default example
  if (!originalText.value && !modifiedText.value) {
    loadExample(examples[0])
  }
  
  // Initialize dark mode
  const { initializeTheme } = useDarkMode()

// Initialize Ko-fi widget
const kofiWidget = useKofiWidget()
  initializeTheme()
})
</script>