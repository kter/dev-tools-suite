<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Markdown Preview</h1>
        <p class="text-gray-600">Preview Markdown files with live rendering and syntax highlighting</p>
      </header>

      <div class="max-w-7xl mx-auto">
        <!-- Toolbar -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-6">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <label for="view-mode" class="text-sm font-medium text-gray-700">View Mode:</label>
              <select
                id="view-mode"
                v-model="viewMode"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="split">Split View</option>
                <option value="edit">Editor Only</option>
                <option value="preview">Preview Only</option>
              </select>
            </div>
            
            <div class="flex items-center gap-2">
              <button
                @click="loadSampleMarkdown"
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Load Sample
              </button>
              <button
                @click="clearMarkdown"
                class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
              <button
                @click="downloadMarkdown"
                :disabled="!markdownText.trim()"
                class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download
              </button>
            </div>
            
            <div class="flex items-center gap-2 ml-auto">
              <span class="text-sm text-gray-600">
                {{ wordCount }} words, {{ characterCount }} characters
              </span>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="grid" :class="gridClass">
            <!-- Editor Panel -->
            <div v-if="showEditor" class="border-r border-gray-200">
              <div class="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-700">Markdown Editor</h3>
              </div>
              <div class="relative">
                <textarea
                  v-model="markdownText"
                  class="w-full h-96 p-4 font-mono text-sm border-none focus:outline-none resize-none"
                  placeholder="Type your markdown here..."
                  @scroll="syncScroll"
                  ref="editorRef"
                />
                <div class="absolute bottom-2 right-2 text-xs text-gray-400">
                  Line {{ currentLine }}
                </div>
              </div>
            </div>

            <!-- Preview Panel -->
            <div v-if="showPreview" class="relative">
              <div class="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-sm font-medium text-gray-700">Preview</h3>
                <div class="flex items-center gap-2">
                  <label class="flex items-center gap-1 text-xs text-gray-600">
                    <input
                      v-model="enableSyntaxHighlighting"
                      type="checkbox"
                      class="rounded"
                    />
                    Syntax Highlighting
                  </label>
                </div>
              </div>
              <div
                class="h-96 p-4 overflow-auto prose prose-sm max-w-none"
                v-html="renderedMarkdown"
                ref="previewRef"
              />
            </div>
          </div>
        </div>

        <!-- Quick Reference -->
        <div class="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Markdown Quick Reference</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 class="font-medium text-gray-800 mb-2">Headers</h4>
              <code class="block text-gray-600"># H1<br>## H2<br>### H3</code>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">Emphasis</h4>
              <code class="block text-gray-600">*italic*<br>**bold**<br>~~strikethrough~~</code>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">Lists</h4>
              <code class="block text-gray-600">- Item 1<br>- Item 2<br>1. Numbered</code>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">Links</h4>
              <code class="block text-gray-600">[Link](url)<br>![Image](url)</code>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">Code</h4>
              <code class="block text-gray-600">`inline code`<br>```<br>code block<br>```</code>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 mb-2">Tables</h4>
              <code class="block text-gray-600">| Col 1 | Col 2 |<br>|-------|-------|<br>| A | B |</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'

// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

const markdownText = ref(`# Welcome to Markdown Preview

This is a **live preview** of your markdown content.

## Features

- Real-time preview
- Syntax highlighting
- Split view mode
- Word count
- Download functionality

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Table Example

| Feature | Status |
|---------|--------|
| Preview | ✅ |
| Editor | ✅ |
| Download | ✅ |

> This is a blockquote with some important information.

Feel free to edit this text and see the preview update in real-time!`)

const viewMode = ref<'split' | 'edit' | 'preview'>('split')
const enableSyntaxHighlighting = ref(true)
const editorRef = ref<HTMLTextAreaElement>()
const previewRef = ref<HTMLDivElement>()

// Configure marked with syntax highlighting
const configureMarked = () => {
  if (!process.client) return

  marked.setOptions({
    highlight: (code, lang) => {
      if (!enableSyntaxHighlighting.value) return code
      
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value
        } catch (err) {
          console.warn('Syntax highlighting failed:', err)
        }
      }
      return hljs.highlightAuto(code).value
    },
    breaks: true,
    gfm: true
  })
}

// Initialize marked configuration
onMounted(() => {
  configureMarked()
})

// Watch for syntax highlighting changes
watch(enableSyntaxHighlighting, () => {
  configureMarked()
})

const renderedMarkdown = computed(() => {
  if (!process.client) return ''
  
  try {
    const rawHtml = marked(markdownText.value)
    return DOMPurify.sanitize(rawHtml)
  } catch (error) {
    console.error('Markdown parsing error:', error)
    return '<p class="text-red-600">Error parsing markdown</p>'
  }
})

const wordCount = computed(() => {
  return markdownText.value.trim() ? markdownText.value.trim().split(/\s+/).length : 0
})

const characterCount = computed(() => {
  return markdownText.value.length
})

const currentLine = computed(() => {
  if (!editorRef.value) return 1
  
  const textarea = editorRef.value
  const text = textarea.value.substring(0, textarea.selectionStart)
  return text.split('\n').length
})

const showEditor = computed(() => viewMode.value === 'split' || viewMode.value === 'edit')
const showPreview = computed(() => viewMode.value === 'split' || viewMode.value === 'preview')

const gridClass = computed(() => {
  if (viewMode.value === 'split') return 'grid-cols-2'
  return 'grid-cols-1'
})

const syncScroll = () => {
  if (!editorRef.value || !previewRef.value || viewMode.value !== 'split') return
  
  const editor = editorRef.value
  const preview = previewRef.value
  
  const scrollPercentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight)
  preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight)
}

const loadSampleMarkdown = () => {
  markdownText.value = `# Sample Markdown Document

## Introduction

This is a comprehensive example of **Markdown** formatting capabilities.

### Text Formatting

You can make text *italic*, **bold**, or ***both***. You can also use ~~strikethrough~~.

### Code Examples

Inline code: \`const message = "Hello, World!"\`

Code block with syntax highlighting:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}
\`\`\`

### Lists

#### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

#### Ordered List
1. First step
2. Second step
3. Third step

### Links and Images

[Visit GitHub](https://github.com)

![Placeholder Image](https://via.placeholder.com/300x200?text=Sample+Image)

### Tables

| Feature | Description | Status |
|---------|-------------|--------|
| Preview | Live markdown preview | ✅ |
| Editor | Syntax highlighting | ✅ |
| Export | Download as file | ✅ |
| Responsive | Mobile friendly | ✅ |

### Blockquotes

> This is a blockquote. It can contain multiple lines
> and even **formatted text**.
>
> - It can also contain lists
> - And other elements

### Horizontal Rule

---

### Math (if supported)

\`\`\`
E = mc²
\`\`\`

### Task Lists

- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task

## Conclusion

This markdown preview tool supports all standard markdown features and more!`
}

const clearMarkdown = () => {
  markdownText.value = ''
}

const downloadMarkdown = () => {
  if (!markdownText.value.trim()) return
  
  const blob = new Blob([markdownText.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Load highlight.js CSS
onMounted(() => {
  if (process.client && enableSyntaxHighlighting.value) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github.min.css'
    document.head.appendChild(link)
  }
})
</script>

<style>
/* Custom styles for the markdown preview */
.prose {
  color: #374151;
}

.prose h1 {
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.prose h2 {
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 0.25rem;
}

.prose code {
  color: #dc2626;
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose pre code {
  color: inherit;
  background-color: transparent;
  padding: 0;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  background-color: #f8fafc;
  padding: 1rem;
  margin: 1rem 0;
}

.prose table {
  border-collapse: collapse;
  width: 100%;
}

.prose table th,
.prose table td {
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  text-align: left;
}

.prose table th {
  background-color: #f9fafb;
  font-weight: 600;
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
}
</style>