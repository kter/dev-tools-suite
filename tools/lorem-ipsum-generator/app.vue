<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="container mx-auto px-4 py-12 max-w-6xl">
      <header class="text-center mb-8 relative">
        <div class="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <h1 class="text-4xl font-bold mb-2">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Lorem Ipsum Generator
          </span>
        </h1>
        <p class="text-gray-600 dark:text-gray-300">Generate placeholder text for your projects with customizable options</p>
      </header>

      <div class="max-w-6xl mx-auto">
        <!-- Generation Options -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Generation Options</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Text Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Text Type</label>
              <select 
                v-model="textType"
                @change="generateText"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="lorem">Lorem Ipsum (Latin)</option>
                <option value="english">English Words</option>
                <option value="japanese">Japanese (銀河鉄道の夜)</option>
                <option value="numbers">Numbers</option>
              </select>
            </div>

            <!-- Generation Unit -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generate by</label>
              <select 
                v-model="generationType"
                @change="generateText"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="words">Words</option>
                <option value="sentences">Sentences</option>
                <option value="paragraphs">Paragraphs</option>
              </select>
            </div>

            <!-- Amount -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount ({{ generationType }})
              </label>
              <input
                v-model.number="amount"
                @input="generateText"
                type="number"
                min="1"
                max="1000"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <!-- Additional Options -->
          <div class="mt-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="flex items-center">
                <input
                  v-model="startWithLorem"
                  @change="generateText"
                  type="checkbox"
                  id="startWithLorem"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label for="startWithLorem" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Start with "Lorem ipsum"</label>
              </div>
              
              <div class="flex items-center">
                <input
                  v-model="includeHtml"
                  @change="generateText"
                  type="checkbox"
                  id="includeHtml"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <label for="includeHtml" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Wrap in HTML paragraphs</label>
              </div>
              
              <div class="flex items-center">
                <input
                  v-model="capitalizeFirst"
                  @change="generateText"
                  type="checkbox"
                  id="capitalizeFirst"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <label for="capitalizeFirst" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Capitalize first letter</label>
              </div>
              
              <div class="flex items-center">
                <input
                  v-model="addPunctuation"
                  @change="generateText"
                  type="checkbox"
                  id="addPunctuation"
                  class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <label for="addPunctuation" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Add punctuation</label>
              </div>
            </div>
          </div>

          <!-- Quick Generate Buttons -->
          <div class="mt-6 flex gap-3 flex-wrap">
            <button
              @click="quickGenerate('words', 50)"
              class="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm"
            >
              50 Words
            </button>
            <button
              @click="quickGenerate('words', 100)"
              class="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm"
            >
              100 Words
            </button>
            <button
              @click="quickGenerate('sentences', 5)"
              class="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm"
            >
              5 Sentences
            </button>
            <button
              @click="quickGenerate('paragraphs', 3)"
              class="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors text-sm"
            >
              3 Paragraphs
            </button>
            <button
              @click="quickGenerate('paragraphs', 5)"
              class="px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors text-sm"
            >
              5 Paragraphs
            </button>
          </div>
        </div>

        <!-- Generated Text -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Generated Text</h3>
            <div class="flex gap-2">
              <button
                v-if="generatedText"
                @click="copyText"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                {{ copyButtonText }}
              </button>
              <button
                v-if="generatedText"
                @click="downloadText"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download
              </button>
            </div>
          </div>
          
          <div class="space-y-4">
            <!-- Text Stats -->
            <div v-if="generatedText" class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ wordCount }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Words</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ characterCount }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Characters</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ sentenceCount }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Sentences</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ paragraphCount }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Paragraphs</div>
              </div>
            </div>
            
            <!-- Generated Text Display -->
            <div 
              v-if="generatedText"
              class="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 min-h-[200px] max-h-[500px] overflow-y-auto"
            >
              <div v-if="includeHtml" v-html="generatedText" class="prose max-w-none text-gray-900 dark:text-white"></div>
              <div v-else class="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-white">{{ generatedText }}</div>
            </div>
            
            <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p class="text-lg">Configure your options and text will be generated here</p>
            </div>
          </div>
        </div>

        <!-- Information -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            About Lorem Ipsum & Japanese Text
          </h3>
          <div class="space-y-2 text-blue-800 dark:text-blue-300 text-sm">
            <p><strong>Lorem Ipsum:</strong> The standard dummy text of the printing industry since the 1500s, derived from Cicero's "de Finibus Bonorum et Malorum" (45 BC).</p>
            <p><strong>銀河鉄道の夜 (Night on the Galactic Railroad):</strong> A masterpiece by Japanese author Kenji Miyazawa, featuring the journey of Giovanni and Campanella through the Milky Way. The Japanese option uses vocabulary from this beloved story.</p>
            <p>Use this tool to generate placeholder text for your design mockups, websites, and documents in multiple languages.</p>
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

    <!-- Universal Support Me Button -->
    <KofiButton kofi-username="kterr" />
</template>

<script setup lang="ts">
import KofiButton from '../shared/components/KofiButton.vue'
// Initialize dark mode
const { initializeTheme } = useDarkMode()

// Initialize Ko-fi widget

// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

const textType = ref('lorem')
const generationType = ref('paragraphs')
const amount = ref(3)
const startWithLorem = ref(true)
const includeHtml = ref(false)
const capitalizeFirst = ref(true)
const addPunctuation = ref(true)

const generatedText = ref('')
const copyButtonText = ref('Copy')

// Word collections for different text types
const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
  'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis'
]

const englishWords = [
  'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'a', 'an',
  'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'beautiful', 'wonderful', 'amazing', 'fantastic', 'incredible', 'awesome',
  'brilliant', 'excellent', 'perfect', 'outstanding', 'remarkable', 'stunning',
  'house', 'home', 'building', 'structure', 'place', 'location', 'area',
  'space', 'room', 'office', 'garden', 'park', 'street', 'road', 'path',
  'people', 'person', 'individual', 'human', 'man', 'woman', 'child', 'family',
  'friend', 'neighbor', 'colleague', 'partner', 'team', 'group', 'community'
]

const japaneseWords = [
  '銀河鉄道', 'ジョバンニ', 'カムパネルラ', '星座', '天の川', '白鳥座', 'さそり座',
  '石炭袋', 'プリオシン海岸', '鷺', 'プリオシン', '化石', '発掘', '博物館',
  '活版所', '新聞', '牛乳', '母親', '病気', '父親', '漁', '北海道',
  'ケンタウル', '南十字', '石炭', '汽車', '切符', '車掌', '燈台', '信号',
  '鳥捕り', '雁', '白鳥', '青い', '美しい', '光る', '輝く', '流れる',
  '歌声', '音楽', '笛', '鐘', '祈り', '讃美歌', '教会', '十字架',
  '林檎', '胡桃', '砂糖', '水晶', '宝石', '金', '銀', '真珠',
  '友達', '仲間', '約束', '旅', '冒険', '夢', '希望', '勇気',
  '悲しい', '寂しい', '嬉しい', '楽しい', '優しい', '温かい', '冷たい', '静か',
  '空', '雲', '風', '雨', '雪', '月', '太陽', '星',
  '野原', '草原', '森', '山', '川', '海', '湖', '島',
  '町', '村', '家', '学校', '教室', '机', '本', '鉛筆',
  'みんな', 'ほんとう', 'どこまでも', 'いっしょに', 'きっと', 'まもなく', 'やがて', 'そして'
]

const numberWords = Array.from({ length: 100 }, (_, i) => (i + 1).toString())

const getWords = (): string[] => {
  switch (textType.value) {
    case 'english': return englishWords
    case 'japanese': return japaneseWords
    case 'numbers': return numberWords
    default: return loremWords
  }
}

const getRandomWord = (): string => {
  const words = getWords()
  return words[Math.floor(Math.random() * words.length)]
}

const generateWords = (count: number): string => {
  const words: string[] = []
  
  if (startWithLorem.value) {
    if (textType.value === 'lorem') {
      words.push('Lorem', 'ipsum')
      count -= 2
    } else if (textType.value === 'japanese') {
      words.push('ジョバンニ', 'は')
      count -= 2
    }
  }
  
  for (let i = 0; i < count; i++) {
    words.push(getRandomWord())
  }
  
  let result = words.join(' ')
  
  if (capitalizeFirst.value && textType.value !== 'japanese') {
    result = result.charAt(0).toUpperCase() + result.slice(1)
  }
  
  if (addPunctuation.value) {
    result += textType.value === 'japanese' ? '。' : '.'
  }
  
  return result
}

const generateSentences = (count: number): string => {
  const sentences: string[] = []
  
  for (let i = 0; i < count; i++) {
    const wordCount = Math.floor(Math.random() * 10) + 8 // 8-17 words per sentence
    let sentence = generateWords(wordCount)
    
    if (!addPunctuation.value) {
      sentence = sentence.replace(/\.$/, '')
    }
    
    sentences.push(sentence)
  }
  
  return sentences.join(' ')
}

const generateParagraphs = (count: number): string => {
  const paragraphs: string[] = []
  
  for (let i = 0; i < count; i++) {
    const sentenceCount = Math.floor(Math.random() * 5) + 3 // 3-7 sentences per paragraph
    const paragraph = generateSentences(sentenceCount)
    paragraphs.push(paragraph)
  }
  
  if (includeHtml.value) {
    return paragraphs.map(p => `<p>${p}</p>`).join('\n')
  }
  
  return paragraphs.join('\n\n')
}

const generateText = () => {
  let text = ''
  
  switch (generationType.value) {
    case 'words':
      text = generateWords(amount.value)
      break
    case 'sentences':
      text = generateSentences(amount.value)
      break
    case 'paragraphs':
      text = generateParagraphs(amount.value)
      break
  }
  
  generatedText.value = text
}

const quickGenerate = (type: string, count: number) => {
  generationType.value = type
  amount.value = count
  generateText()
}

const wordCount = computed(() => {
  if (!generatedText.value) return 0
  const text = generatedText.value.replace(/<[^>]*>/g, '') // Remove HTML tags
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
})

const characterCount = computed(() => {
  if (!generatedText.value) return 0
  const text = generatedText.value.replace(/<[^>]*>/g, '') // Remove HTML tags
  return text.length
})

const sentenceCount = computed(() => {
  if (!generatedText.value) return 0
  const text = generatedText.value.replace(/<[^>]*>/g, '') // Remove HTML tags
  return (text.match(/[.!?]+/g) || []).length
})

const paragraphCount = computed(() => {
  if (!generatedText.value) return 0
  if (includeHtml.value) {
    return (generatedText.value.match(/<p>/g) || []).length
  }
  return generatedText.value.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
})

const copyText = async () => {
  if (!generatedText.value) return
  
  let textToCopy = generatedText.value
  if (includeHtml.value) {
    // Remove HTML tags for plain text copy
    textToCopy = textToCopy.replace(/<[^>]*>/g, '').replace(/\n/g, '\n\n')
  }
  
  try {
    await navigator.clipboard.writeText(textToCopy)
    copyButtonText.value = 'Copied!'
    setTimeout(() => {
      copyButtonText.value = 'Copy'
    }, 2000)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const downloadText = () => {
  if (!generatedText.value) return
  
  let content = generatedText.value
  let filename = 'lorem-ipsum.txt'
  let mimeType = 'text/plain'
  
  if (includeHtml.value) {
    content = `<!DOCTYPE html>
<html>
<head>
    <title>Lorem Ipsum</title>
    <meta charset="utf-8">
</head>
<body>
    ${content}
</body>
</html>`
    filename = 'lorem-ipsum.html'
    mimeType = 'text/html'
  }
  
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

// Initialize theme and generate initial text
onMounted(() => {
  initializeTheme()
  generateText()
})
</script>