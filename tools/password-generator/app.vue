<template>
  <!-- Password Generator Tool v1.1 -->
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="container mx-auto px-4 py-12">
      <header class="text-center mb-12 relative">
        <!-- Theme Toggle -->
        <div class="absolute right-0 top-0">
          <ThemeToggle />
        </div>
        
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            Password Generator
          </span>
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Generate secure passwords with customizable options
        </p>
      </header>

      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Password Settings -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Password Settings</h2>
          
          <!-- Length Slider -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password Length: {{ passwordLength }}
            </label>
            <input
              v-model="passwordLength"
              type="range"
              min="4"
              max="128"
              class="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          <!-- Character Type Options -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <label class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <input
                v-model="includeUppercase"
                type="checkbox"
                class="w-4 h-4 text-purple-600 border-gray-300 dark:border-gray-500 rounded focus:ring-purple-500 bg-white dark:bg-gray-700"
              />
              <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Uppercase Letters (A-Z)</span>
            </label>
            
            <label class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <input
                v-model="includeLowercase"
                type="checkbox"
                class="w-4 h-4 text-purple-600 border-gray-300 dark:border-gray-500 rounded focus:ring-purple-500 bg-white dark:bg-gray-700"
              />
              <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Lowercase Letters (a-z)</span>
            </label>
            
            <label class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <input
                v-model="includeNumbers"
                type="checkbox"
                class="w-4 h-4 text-purple-600 border-gray-300 dark:border-gray-500 rounded focus:ring-purple-500 bg-white dark:bg-gray-700"
              />
              <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
            </label>
            
            <label class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <input
                v-model="includeSymbols"
                type="checkbox"
                class="w-4 h-4 text-purple-600 border-gray-300 dark:border-gray-500 rounded focus:ring-purple-500 bg-white dark:bg-gray-700"
              />
              <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Symbols (!@#$%^&*)</span>
            </label>
          </div>

          <!-- Advanced Options -->
          <div class="border-t border-gray-200 dark:border-gray-600 pt-6 space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Advanced Options</h3>
            
            <label class="flex items-center">
              <input
                v-model="excludeSimilar"
                type="checkbox"
                class="w-4 h-4 text-purple-600 border-gray-300 dark:border-gray-500 rounded focus:ring-purple-500 bg-white dark:bg-gray-700"
              />
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Exclude similar characters (0, O, l, I, 1)</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="excludeAmbiguous"
                type="checkbox"
                class="w-4 h-4 text-purple-600 border-gray-300 dark:border-gray-500 rounded focus:ring-purple-500 bg-white dark:bg-gray-700"
              />
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Exclude ambiguous characters ({, }, [, ], (, ), /, \, ', ", ~, ,, ;, <, >)</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="requireAllTypes"
                type="checkbox"
                class="w-4 h-4 text-purple-600 border-gray-300 dark:border-gray-500 rounded focus:ring-purple-500 bg-white dark:bg-gray-700"
              />
              <span class="ml-3 text-sm text-gray-700 dark:text-gray-300">Require at least one character from each selected type</span>
            </label>
          </div>

          <!-- Generate Button -->
          <div class="mt-6">
            <button
              @click="generatePassword"
              :disabled="!canGenerate"
              class="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Generate Password
            </button>
            <p v-if="!canGenerate" class="text-red-500 dark:text-red-400 text-sm mt-2 text-center">
              Please select at least one character type
            </p>
          </div>
        </div>

        <!-- Generated Password -->
        <div v-if="generatedPassword" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Generated Password</h2>
          
          <div class="relative">
            <div class="flex items-center space-x-4">
              <div class="flex-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono text-lg break-all border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                {{ displayPassword }}
              </div>
              <div class="flex flex-col space-y-2">
                <button
                  @click="copyPassword"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <span>Copy</span>
                </button>
                
                <button
                  @click="togglePasswordVisibility"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <span>{{ showPassword ? 'Hide' : 'Show' }}</span>
                </button>
              </div>
            </div>
            
            <div v-if="copiedMessage" class="absolute top-full left-0 mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded shadow-lg z-10">
              {{ copiedMessage }}
            </div>
          </div>
          
          <!-- Password Strength Analysis -->
          <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Password Strength Analysis</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-300">Strength:</span>
                <span :class="passwordStrength.color" class="text-sm font-medium">{{ passwordStrength.label }}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  :class="passwordStrength.barColor" 
                  class="h-2 rounded-full transition-all duration-300"
                  :style="{ width: passwordStrength.percentage + '%' }"
                ></div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Entropy: ~{{ passwordEntropy }} bits
              </div>
            </div>
          </div>
        </div>

        <!-- Password History -->
        <div v-if="passwordHistory.length > 0" class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Password History</h2>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div 
              v-for="(password, index) in passwordHistory.slice().reverse()" 
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
            >
              <span class="font-mono break-all flex-1 mr-4 text-gray-900 dark:text-white">{{ password.slice(0, 20) }}{{ password.length > 20 ? '...' : '' }}</span>
              <button
                @click="copyToClipboard(password)"
                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
          <button
            @click="clearHistory"
            class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Clear History
          </button>
        </div>

        <!-- Security Tips -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Security Tips</h2>
          <div class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Use unique passwords for each of your accounts</p>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Store passwords securely using a password manager</p>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Enable two-factor authentication whenever possible</p>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Regularly update your passwords, especially for important accounts</p>
            </div>
            <div class="flex items-start space-x-3">
              <div class="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Never share your passwords or store them in plain text</p>
            </div>
          </div>
        </div>
      </div>

      <footer class="mt-16 text-center text-gray-500 dark:text-gray-400">
        <p>All password generation happens locally in your browser for maximum security</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO protection for dev environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

useHead({
  title: 'Password Generator - DevTools'
})

// Password settings
const passwordLength = ref(16)
const includeUppercase = ref(true)
const includeLowercase = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(false)
const excludeSimilar = ref(false)
const excludeAmbiguous = ref(false)
const requireAllTypes = ref(false)

// Password display
const generatedPassword = ref('')
const showPassword = ref(true)
const copiedMessage = ref('')
const passwordHistory = ref<string[]>([])

// Character sets
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
const numberChars = '0123456789'
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const similarChars = '0Ol1I'
const ambiguousChars = '{}[]()//\\\'";,<>~'

// Computed properties
const canGenerate = computed(() => {
  return includeUppercase.value || includeLowercase.value || includeNumbers.value || includeSymbols.value
})

const displayPassword = computed(() => {
  if (!showPassword.value) {
    return '•'.repeat(generatedPassword.value.length)
  }
  return generatedPassword.value
})

const passwordEntropy = computed(() => {
  if (!generatedPassword.value) return 0
  const charsetSize = getCharacterSet().length
  return Math.floor(Math.log2(Math.pow(charsetSize, generatedPassword.value.length)))
})

const passwordStrength = computed(() => {
  const entropy = passwordEntropy.value
  
  if (entropy < 30) {
    return { label: 'Very Weak', color: 'text-red-600', barColor: 'bg-red-500', percentage: 20 }
  } else if (entropy < 50) {
    return { label: 'Weak', color: 'text-orange-600', barColor: 'bg-orange-500', percentage: 40 }
  } else if (entropy < 70) {
    return { label: 'Fair', color: 'text-yellow-600', barColor: 'bg-yellow-500', percentage: 60 }
  } else if (entropy < 90) {
    return { label: 'Strong', color: 'text-green-600', barColor: 'bg-green-500', percentage: 80 }
  } else {
    return { label: 'Very Strong', color: 'text-green-700', barColor: 'bg-green-600', percentage: 100 }
  }
})

// Helper functions
const getCharacterSet = () => {
  let charset = ''
  
  if (includeUppercase.value) charset += uppercaseChars
  if (includeLowercase.value) charset += lowercaseChars
  if (includeNumbers.value) charset += numberChars
  if (includeSymbols.value) charset += symbolChars
  
  // Remove similar characters if requested
  if (excludeSimilar.value) {
    charset = charset.split('').filter(char => !similarChars.includes(char)).join('')
  }
  
  // Remove ambiguous characters if requested
  if (excludeAmbiguous.value) {
    charset = charset.split('').filter(char => !ambiguousChars.includes(char)).join('')
  }
  
  return charset
}

const getSecureRandomInt = (max: number) => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1)
    window.crypto.getRandomValues(array)
    return array[0] % max
  } else {
    // Fallback for non-secure environments
    return Math.floor(Math.random() * max)
  }
}

const generatePassword = () => {
  if (!canGenerate.value) return
  
  const charset = getCharacterSet()
  if (charset.length === 0) return
  
  let password = ''
  
  // If require all types is enabled, ensure at least one character from each selected type
  if (requireAllTypes.value) {
    const requiredChars: string[] = []
    
    if (includeUppercase.value) {
      let chars = uppercaseChars
      if (excludeSimilar.value) chars = chars.split('').filter(char => !similarChars.includes(char)).join('')
      if (excludeAmbiguous.value) chars = chars.split('').filter(char => !ambiguousChars.includes(char)).join('')
      if (chars.length > 0) requiredChars.push(chars[getSecureRandomInt(chars.length)])
    }
    
    if (includeLowercase.value) {
      let chars = lowercaseChars
      if (excludeSimilar.value) chars = chars.split('').filter(char => !similarChars.includes(char)).join('')
      if (excludeAmbiguous.value) chars = chars.split('').filter(char => !ambiguousChars.includes(char)).join('')
      if (chars.length > 0) requiredChars.push(chars[getSecureRandomInt(chars.length)])
    }
    
    if (includeNumbers.value) {
      let chars = numberChars
      if (excludeSimilar.value) chars = chars.split('').filter(char => !similarChars.includes(char)).join('')
      if (excludeAmbiguous.value) chars = chars.split('').filter(char => !ambiguousChars.includes(char)).join('')
      if (chars.length > 0) requiredChars.push(chars[getSecureRandomInt(chars.length)])
    }
    
    if (includeSymbols.value) {
      let chars = symbolChars
      if (excludeSimilar.value) chars = chars.split('').filter(char => !similarChars.includes(char)).join('')
      if (excludeAmbiguous.value) chars = chars.split('').filter(char => !ambiguousChars.includes(char)).join('')
      if (chars.length > 0) requiredChars.push(chars[getSecureRandomInt(chars.length)])
    }
    
    // Add required characters to password
    for (const char of requiredChars) {
      password += char
    }
    
    // Fill remaining length with random characters
    for (let i = password.length; i < passwordLength.value; i++) {
      password += charset[getSecureRandomInt(charset.length)]
    }
    
    // Shuffle the password to avoid predictable patterns
    password = password.split('').sort(() => getSecureRandomInt(3) - 1).join('')
  } else {
    // Standard random generation
    for (let i = 0; i < passwordLength.value; i++) {
      password += charset[getSecureRandomInt(charset.length)]
    }
  }
  
  generatedPassword.value = password
  
  // Add to history
  if (!passwordHistory.value.includes(password)) {
    passwordHistory.value.push(password)
    
    // Keep only last 10 passwords
    if (passwordHistory.value.length > 10) {
      passwordHistory.value = passwordHistory.value.slice(-10)
    }
  }
}

const copyPassword = async () => {
  await copyToClipboard(generatedPassword.value)
}

const copyToClipboard = async (text: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      // Fallback for non-secure contexts
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }
    
    copiedMessage.value = 'Password copied to clipboard!'
    setTimeout(() => {
      copiedMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('Failed to copy password:', err)
    copiedMessage.value = 'Failed to copy password'
    setTimeout(() => {
      copiedMessage.value = ''
    }, 2000)
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const clearHistory = () => {
  passwordHistory.value = []
}

// Dark mode
const { initializeTheme } = useDarkMode()

// Generate initial password on mount
onMounted(() => {
  // Initialize theme
  initializeTheme()
  
  generatePassword()
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #9333ea;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #9333ea;
  cursor: pointer;
  border: none;
}

/* Dark mode support for sliders */
.dark .slider::-webkit-slider-thumb {
  background: #a855f7;
}

.dark .slider::-moz-range-thumb {
  background: #a855f7;
}
</style>