<!--
  ToolGrid component
  Add filtering support, show/hide tools based on search results
  Enhanced version of the existing tool grid with search integration
-->

<template>
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Tool Cards -->
      <div
        v-for="tool in displayedTools"
        :key="tool.id"
        data-testid="tool-card"
        class="tool-card"
        @click="selectTool(tool)"
      >
        <div class="flex items-center mb-4">
          <div class="tool-icon">
            <span class="text-white font-bold text-lg">{{ tool.icon || getDefaultIcon(tool.name) }}</span>
          </div>
          <div>
            <h3
              data-testid="tool-name"
              class="tool-name"
            >
              {{ tool.name }}
            </h3>
            <span class="tool-status">
              Available
            </span>
          </div>
        </div>

        <p
          data-testid="tool-description"
          class="tool-description"
        >
          {{ tool.description }}
        </p>

        <!-- Tags (if available) -->
        <div v-if="tool.tags && tool.tags.length > 0" class="tool-tags">
          <span
            v-for="tag in tool.tags"
            :key="tag"
            class="tool-tag"
          >
            {{ tag }}
          </span>
        </div>

        <span class="tool-link">
          Launch Tool
        </span>
      </div>
    </div>

    <!-- Empty State for No Tools -->
    <div
      v-if="displayedTools.length === 0 && tools.length > 0"
      class="no-tools-message"
    >
      <!-- Empty space as per clarifications - no message for filtered results -->
    </div>

    <!-- Loading State -->
    <div
      v-if="tools.length === 0"
      class="loading-state"
    >
      <div class="text-center text-gray-600 dark:text-gray-300">
        Loading tools...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tool } from '../types/tool'
import type { ToolGridProps, ToolGridEmits } from '../types/components'

// Props and Emits
const props = withDefaults(defineProps<ToolGridProps>(), {
  filtered: false,
  searchQuery: ''
})

const emit = defineEmits<ToolGridEmits>()

// Computed tools to display
const displayedTools = computed(() => {
  if (props.filtered && props.searchQuery) {
    // When filtered prop is true, show only the provided tools (already filtered)
    return props.tools
  } else {
    // Show all tools (default behavior)
    return props.tools
  }
})

// Select tool function
const selectTool = (tool: Tool): void => {
  emit('select', tool)
}

// Get default icon for tools that don't have one
const getDefaultIcon = (toolName: string): string => {
  // Simple icon mapping based on tool name
  const iconMap: Record<string, string> = {
    'password': '🔒',
    'hash': '#',
    'qr': '📱',
    'timer': '⏰',
    'json': '{}',
    'regex': '.*',
    'image': '🖼️',
    'string': 'Aa',
    'ip': '🌐',
    'unix': '📅',
    'jwt': '🎫',
    'markdown': '📝',
    'placeholder': '🖼️',
    'lorem': '📄',
    'mic': '🎤',
    'badger': '🛡️',
    'character': '💭',
    'code': '💻',
    'poster': '🎨'
  }

  // Find matching keyword in tool name
  const toolNameLower = toolName.toLowerCase()
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (toolNameLower.includes(keyword)) {
      return icon
    }
  }

  // Default icon
  return '🔧'
}

// Utility function to check if tool matches search (for debugging)
const toolMatchesSearch = (tool: Tool, query: string): boolean => {
  if (!query.trim()) return true

  const searchLower = query.toLowerCase()
  return (
    tool.name.toLowerCase().includes(searchLower) ||
    tool.description.toLowerCase().includes(searchLower) ||
    tool.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false
  )
}

// Expose functions for parent components
defineExpose({
  getDisplayedTools: () => displayedTools.value,
  toolMatchesSearch
})
</script>

<style scoped>
.tool-card {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6;
  @apply border border-gray-100 dark:border-gray-700 hover:scale-105 cursor-pointer;
}

.tool-icon {
  @apply w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700;
  @apply rounded-lg flex items-center justify-center mr-4;
}

.tool-name {
  @apply text-lg font-semibold text-gray-900 dark:text-white;
}

.tool-status {
  @apply inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900;
  @apply text-green-800 dark:text-green-200 rounded-full;
}

.tool-description {
  @apply text-gray-600 dark:text-gray-300 text-sm mb-4;
}

.tool-tags {
  @apply flex flex-wrap gap-2 mb-4;
}

.tool-tag {
  @apply inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900;
  @apply text-blue-800 dark:text-blue-200 rounded-full;
}

.tool-link {
  @apply inline-block w-full text-center px-4 py-2 bg-blue-600 dark:bg-blue-500;
  @apply text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors;
}

.no-tools-message {
  @apply h-64 flex items-center justify-center;
}

.loading-state {
  @apply h-64 flex items-center justify-center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tool-card {
    @apply hover:scale-100; /* Disable hover scale on mobile */
  }
}

/* Search result highlighting (if needed in future) */
.search-highlight {
  @apply bg-yellow-200 dark:bg-yellow-800;
}

/* Animation for tool cards appearing/disappearing */
.tool-card {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus styles for accessibility */
.tool-card:focus-within {
  @apply ring-2 ring-blue-500 ring-offset-2;
}

.tool-link:focus {
  @apply ring-2 ring-blue-500 ring-offset-2;
}
</style>