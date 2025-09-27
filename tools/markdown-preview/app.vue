<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <header class="text-center mb-8 relative">
        <!-- Theme Toggle -->
        <div class="absolute right-0 top-0">
          <ThemeToggle />
        </div>
        
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Markdown Preview
          </span>
        </h1>
        <p class="text-gray-600 dark:text-gray-300">Preview Markdown files with live rendering and syntax highlighting</p>
      </header>

      <div class="max-w-7xl mx-auto">
        <!-- Toolbar -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 transition-colors duration-300">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <label for="view-mode" class="text-sm font-medium text-gray-700 dark:text-gray-300">View Mode:</label>
              <select
                id="view-mode"
                v-model="viewMode"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="split">Split View</option>
                <option value="edit">Editor Only</option>
                <option value="preview">Preview Only</option>
              </select>
            </div>
            
            <div class="flex items-center gap-2">
              <button
                @click="loadSampleMarkdown"
                class="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Load Sample
              </button>
              <button
                @click="clearMarkdown"
                class="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Clear
              </button>
              <button
                @click="downloadMarkdown"
                :disabled="!markdownText.trim()"
                class="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download
              </button>
            </div>
            
            <div class="flex items-center gap-2 ml-auto">
              <span class="text-sm text-gray-600 dark:text-gray-300">
                {{ wordCount }} words, {{ characterCount }} characters
              </span>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300">
          <div class="grid" :class="gridClass">
            <!-- Editor Panel -->
            <div v-if="showEditor" class="border-r border-gray-200 dark:border-gray-700">
              <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Markdown Editor</h3>
              </div>
              <div class="relative">
                <textarea
                  v-model="markdownText"
                  class="w-full h-96 p-4 font-mono text-sm border-none focus:outline-none resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Type your markdown here..."
                  @scroll="syncScroll"
                  ref="editorRef"
                />
                <div class="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                  Line {{ currentLine }}
                </div>
              </div>
            </div>

            <!-- Preview Panel -->
            <div v-if="showPreview" class="relative">
              <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</h3>
                <div class="flex items-center gap-2">
                  <label class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                    <input
                      v-model="enableSyntaxHighlighting"
                      type="checkbox"
                      class="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500"
                    />
                    Syntax Highlighting
                  </label>
                </div>
              </div>
              <div
                class="h-96 p-4 overflow-auto prose prose-sm max-w-none dark:prose-invert"
                v-html="renderedMarkdown"
                ref="previewRef"
              />
            </div>
          </div>
        </div>

        <!-- Quick Reference -->
        <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Markdown Quick Reference</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Headers</h4>
              <code class="block text-gray-600 dark:text-gray-300"># H1<br>## H2<br>### H3</code>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Emphasis</h4>
              <code class="block text-gray-600 dark:text-gray-300">*italic*<br>**bold**<br>~~strikethrough~~</code>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Lists</h4>
              <code class="block text-gray-600 dark:text-gray-300">- Item 1<br>- Item 2<br>1. Numbered</code>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Links</h4>
              <code class="block text-gray-600 dark:text-gray-300">[Link](url)<br>![Image](url)</code>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Code</h4>
              <code class="block text-gray-600 dark:text-gray-300">`inline code`<br>```<br>code block<br>```</code>
            </div>
            <div>
              <h4 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Tables</h4>
              <code class="block text-gray-600 dark:text-gray-300">| Col 1 | Col 2 |<br>|-------|-------|<br>| A | B |</code>
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

// Dark mode
const { initializeTheme, isDarkMode } = useDarkMode()

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

  try {
    // Reset marked to default configuration first
    marked.setOptions(marked.getDefaults())
    
    // Set our custom options
    marked.setOptions({
      breaks: true,
      gfm: true,
      pedantic: false,
      sanitize: false,
      smartypants: false,
      highlight: function(code, lang) {
        if (!enableSyntaxHighlighting.value) {
          return code
        }
        
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value
          } catch (err) {
            console.warn('Syntax highlighting failed for', lang, ':', err)
            return code
          }
        }
        try {
          return hljs.highlightAuto(code).value
        } catch (err) {
          console.warn('Auto highlighting failed:', err)
          return code
        }
      }
    })
  } catch (error) {
    console.error('Error configuring marked:', error)
  }
}

// Initialize marked configuration
onMounted(() => {
  // Initialize theme
  initializeTheme()
  
  configureMarked()
  loadHighlightCSS()
})


const renderedMarkdown = computed(() => {
  if (!process.client) return ''
  
  try {
    const rawHtml = marked(markdownText.value)
    // Configure DOMPurify to allow more HTML elements for markdown
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'a', 'img', 'hr', 'div', 'span'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style'],
      ALLOW_DATA_ATTR: false
    })
    return cleanHtml
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

// Load highlight.js CSS with dark mode support
const loadHighlightCSS = () => {
  if (!process.client || !enableSyntaxHighlighting.value) return
  
  // Remove existing highlight.js stylesheets
  const existingLinks = document.querySelectorAll('link[href*="highlight.js"]')
  existingLinks.forEach(link => link.remove())
  
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.id = 'highlight-css'
  
  // Use different themes for light and dark mode
  if (isDarkMode.value) {
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github-dark.min.css'
  } else {
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/github.min.css'
  }
  
  document.head.appendChild(link)
}

// Watch for dark mode changes to update highlight.js theme
watch(isDarkMode, () => {
  loadHighlightCSS()
})

// Watch for syntax highlighting changes
watch(enableSyntaxHighlighting, () => {
  configureMarked()
  loadHighlightCSS()
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

/* Dark mode styles */
.dark .prose {
  color: #d1d5db;
}

.dark .prose h1 {
  color: #f9fafb;
  border-bottom: 1px solid #374151;
}

.dark .prose h2 {
  color: #e5e7eb;
  border-bottom: 1px solid #4b5563;
}

.dark .prose code {
  color: #fca5a5;
  background-color: #374151;
}

.dark .prose pre {
  background-color: #1f2937;
  border: 1px solid #4b5563;
}

.dark .prose blockquote {
  border-left: 4px solid #60a5fa;
  background-color: #1f2937;
}

.dark .prose table th,
.dark .prose table td {
  border: 1px solid #4b5563;
}

.dark .prose table th {
  background-color: #374151;
}
</style>