<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <div class="flex justify-between items-center mb-4">
          <div class="flex-1"></div>
          <div class="flex-1 text-center">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Mic Test</h1>
          </div>
          <div class="flex-1 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
        <p class="text-gray-600 dark:text-gray-400">Test your microphone by recording and playing back audio to verify it works correctly</p>
      </header>

      <div class="max-w-4xl mx-auto">
        <!-- Permission and Status -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Microphone Status</h2>
          
          <div v-if="!hasPermission && !permissionDenied" class="text-center py-8">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Microphone Access Required</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">Click the button below to grant microphone permission and start testing.</p>
            <button
              @click="requestMicrophoneAccess"
              :disabled="requestingPermission"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ requestingPermission ? 'Requesting Permission...' : 'Enable Microphone' }}
            </button>
          </div>

          <div v-else-if="permissionDenied" class="text-center py-8">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
              <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Microphone Access Denied</h3>
            <p class="text-red-600 dark:text-red-400 mb-4">Please allow microphone access in your browser settings and refresh the page.</p>
            <button
              @click="refreshPage"
              class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>

          <div v-else-if="hasPermission" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div class="text-sm text-green-800 dark:text-green-200 font-medium">Microphone</div>
              <div class="text-xs text-green-600 dark:text-green-400">Connected</div>
            </div>
            <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12 6.5z"></path>
                </svg>
              </div>
              <div class="text-sm text-blue-800 dark:text-blue-200 font-medium">Audio Level</div>
              <div class="text-xs text-blue-600 dark:text-blue-400">{{ audioLevel }}%</div>
            </div>
            <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14L17 4M9 8v8m2-8v8m2-8v8"></path>
                </svg>
              </div>
              <div class="text-sm text-purple-800 dark:text-purple-200 font-medium">Device</div>
              <div class="text-xs text-purple-600 dark:text-purple-400">{{ selectedDevice || 'Default' }}</div>
            </div>
          </div>
        </div>

        <!-- Audio Level Meter -->
        <div v-if="hasPermission" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Audio Level Monitor</h3>
          <div class="space-y-4">
            <!-- Visual Level Meter -->
            <div class="relative">
              <div class="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden transition-colors">
                <div 
                  class="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-75"
                  :style="{ width: audioLevel + '%' }"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Silent</span>
                <span>Moderate</span>
                <span>Loud</span>
              </div>
            </div>
            
            <!-- Numeric Display -->
            <div class="text-center">
              <span class="text-2xl font-bold" :class="getLevelColor()">{{ audioLevel }}%</span>
              <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">{{ getLevelDescription() }}</span>
            </div>
          </div>
        </div>

        <!-- Device Selection -->
        <div v-if="hasPermission && availableDevices.length > 1" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Microphone Selection</h3>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Microphone Device:</label>
            <select 
              v-model="selectedDeviceId"
              @change="changeDevice"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="">Default Device</option>
              <option 
                v-for="device in availableDevices" 
                :key="device.deviceId" 
                :value="device.deviceId"
              >
                {{ device.label || `Microphone ${device.deviceId.slice(0, 8)}...` }}
              </option>
            </select>
          </div>
        </div>

        <!-- Recording Controls -->
        <div v-if="hasPermission" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recording Test</h3>
          
          <div class="text-center space-y-4">
            <!-- Recording Status -->
            <div v-if="isRecording" class="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg transition-colors">
              <div class="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full animate-pulse"></div>
              <span class="text-red-800 dark:text-red-200 font-medium">Recording... {{ recordingDuration }}s</span>
            </div>
            
            <div v-else-if="recordedBlob" class="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg transition-colors">
              <div class="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full"></div>
              <span class="text-green-800 dark:text-green-200 font-medium">Recording completed ({{ lastRecordingDuration }}s)</span>
            </div>

            <!-- Control Buttons -->
            <div class="flex justify-center gap-4">
              <button
                v-if="!isRecording"
                @click="startRecording"
                :disabled="!hasPermission"
                class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
                Start Recording
              </button>
              
              <button
                v-else
                @click="stopRecording"
                class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6v4H9z"></path>
                </svg>
                Stop Recording
              </button>
            </div>

            <!-- Playback Controls -->
            <div v-if="recordedBlob" class="mt-6 space-y-4">
              <h4 class="text-md font-medium text-gray-800 dark:text-gray-200">Playback Test</h4>
              
              <audio 
                ref="audioPlayer"
                controls 
                class="w-full max-w-md mx-auto"
                @loadedmetadata="updateAudioDuration"
              ></audio>
              
              <div class="flex justify-center gap-4">
                <button
                  @click="playRecording"
                  :disabled="isPlaying"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V8a2 2 0 012-2h2a2 2 0 012 2v2"></path>
                  </svg>
                  {{ isPlaying ? 'Playing...' : 'Play Recording' }}
                </button>
                
                <button
                  @click="downloadRecording"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download
                </button>
                
                <button
                  @click="clearRecording"
                  class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Information -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 transition-colors">
          <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Privacy & Security
          </h3>
          <div class="space-y-2 text-blue-800 dark:text-blue-200">
            <p class="flex items-start gap-2">
              <svg class="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              All audio processing happens locally in your browser
            </p>
            <p class="flex items-start gap-2">
              <svg class="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              No audio data is sent to any server
            </p>
            <p class="flex items-start gap-2">
              <svg class="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Recordings are temporary and deleted when you close the page
            </p>
            <p class="flex items-start gap-2">
              <svg class="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              You can revoke microphone permission at any time in browser settings
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Add noindex for development environment
if (process.client && window.location.hostname.includes('dev.devtools.site')) {
  useHead({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ]
  })
}

const hasPermission = ref(false)
const permissionDenied = ref(false)
const requestingPermission = ref(false)
const audioLevel = ref(0)
const selectedDevice = ref('')
const selectedDeviceId = ref('')
const availableDevices = ref<MediaDeviceInfo[]>([])

const isRecording = ref(false)
const recordingDuration = ref(0)
const lastRecordingDuration = ref(0)
const recordedBlob = ref<Blob | null>(null)
const isPlaying = ref(false)

const audioPlayer = ref<HTMLAudioElement>()
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioContext = ref<AudioContext | null>(null)
const analyser = ref<AnalyserNode | null>(null)
const microphone = ref<MediaStreamAudioSourceNode | null>(null)
const mediaStream = ref<MediaStream | null>(null)
const recordingTimer = ref<NodeJS.Timeout | null>(null)
const animationFrame = ref<number | null>(null)

const requestMicrophoneAccess = async () => {
  requestingPermission.value = true
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    })
    
    hasPermission.value = true
    permissionDenied.value = false
    mediaStream.value = stream
    
    await setupAudioContext(stream)
    await loadAvailableDevices()
    startAudioLevelMonitoring()
    
  } catch (error) {
    console.error('Microphone access denied:', error)
    permissionDenied.value = true
    hasPermission.value = false
  } finally {
    requestingPermission.value = false
  }
}

const setupAudioContext = async (stream: MediaStream) => {
  try {
    audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
    analyser.value = audioContext.value.createAnalyser()
    microphone.value = audioContext.value.createMediaStreamSource(stream)
    
    analyser.value.fftSize = 256
    analyser.value.smoothingTimeConstant = 0.8
    
    microphone.value.connect(analyser.value)
  } catch (error) {
    console.error('Audio context setup failed:', error)
  }
}

const loadAvailableDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    availableDevices.value = devices.filter(device => device.kind === 'audioinput')
    
    if (availableDevices.value.length > 0 && mediaStream.value) {
      const currentDevice = availableDevices.value.find(device => 
        device.deviceId === mediaStream.value?.getAudioTracks()[0]?.getSettings().deviceId
      )
      if (currentDevice) {
        selectedDevice.value = currentDevice.label || 'Default Microphone'
        selectedDeviceId.value = currentDevice.deviceId
      }
    }
  } catch (error) {
    console.error('Failed to load devices:', error)
  }
}

const changeDevice = async () => {
  if (!selectedDeviceId.value) return
  
  // Stop current stream
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
  }
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: selectedDeviceId.value,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    })
    
    mediaStream.value = stream
    await setupAudioContext(stream)
    
    const device = availableDevices.value.find(d => d.deviceId === selectedDeviceId.value)
    selectedDevice.value = device?.label || 'Selected Microphone'
    
  } catch (error) {
    console.error('Failed to change device:', error)
  }
}

const startAudioLevelMonitoring = () => {
  if (!analyser.value) return
  
  const bufferLength = analyser.value.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  
  const updateLevel = () => {
    if (!analyser.value) return
    
    analyser.value.getByteFrequencyData(dataArray)
    
    let sum = 0
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i]
    }
    const average = sum / bufferLength
    audioLevel.value = Math.round((average / 255) * 100)
    
    animationFrame.value = requestAnimationFrame(updateLevel)
  }
  
  updateLevel()
}

const getLevelColor = () => {
  if (audioLevel.value < 10) return 'text-gray-500 dark:text-gray-400'
  if (audioLevel.value < 30) return 'text-green-600 dark:text-green-400'
  if (audioLevel.value < 70) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const getLevelDescription = () => {
  if (audioLevel.value < 10) return 'Very quiet'
  if (audioLevel.value < 30) return 'Quiet'
  if (audioLevel.value < 50) return 'Moderate'
  if (audioLevel.value < 70) return 'Loud'
  return 'Very loud'
}

const startRecording = () => {
  if (!mediaStream.value) return
  
  try {
    const chunks: Blob[] = []
    mediaRecorder.value = new MediaRecorder(mediaStream.value)
    
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }
    
    mediaRecorder.value.onstop = () => {
      recordedBlob.value = new Blob(chunks, { type: 'audio/webm' })
      setupAudioPlayer()
    }
    
    mediaRecorder.value.start()
    isRecording.value = true
    recordingDuration.value = 0
    
    recordingTimer.value = setInterval(() => {
      recordingDuration.value++
    }, 1000)
    
  } catch (error) {
    console.error('Failed to start recording:', error)
  }
}

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false
    lastRecordingDuration.value = recordingDuration.value
    
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value)
      recordingTimer.value = null
    }
  }
}

const setupAudioPlayer = () => {
  if (recordedBlob.value && audioPlayer.value) {
    const audioUrl = URL.createObjectURL(recordedBlob.value)
    audioPlayer.value.src = audioUrl
  }
}

const playRecording = () => {
  if (audioPlayer.value) {
    audioPlayer.value.play()
    isPlaying.value = true
    
    audioPlayer.value.onended = () => {
      isPlaying.value = false
    }
  }
}

const downloadRecording = () => {
  if (recordedBlob.value) {
    const url = URL.createObjectURL(recordedBlob.value)
    const link = document.createElement('a')
    link.href = url
    link.download = `mic-test-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`
    link.click()
    URL.revokeObjectURL(url)
  }
}

const clearRecording = () => {
  recordedBlob.value = null
  isPlaying.value = false
  if (audioPlayer.value) {
    audioPlayer.value.src = ''
  }
}

const updateAudioDuration = () => {
  // This function can be used to display audio duration if needed
}

const refreshPage = () => {
  window.location.reload()
}

onMounted(() => {
  // Check if microphone is already available
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Browser supports getUserMedia
  } else {
    console.error('getUserMedia not supported')
  }
  
  // Initialize dark mode
  const { initializeTheme } = useDarkMode()
  initializeTheme()
})

onUnmounted(() => {
  // Clean up resources
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
  }
  
  if (audioContext.value) {
    audioContext.value.close()
  }
  
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
  
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value)
  }
})
</script>