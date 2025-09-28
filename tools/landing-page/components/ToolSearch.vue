<!--
  ToolSearch overlay component
  Implements fixed overlay with Teleport, search input, keyboard shortcuts
  Based on research.md architectural decisions and contracts/tool-search-api.ts
-->

<template>
  <Teleport to="body">
    <div
      v-if="modalState.isOpen.value"
      data-testid="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-title"
      aria-describedby="search-description"
      class="search-overlay"
      @click="handleBackdropClick"
    >
      <!-- Backdrop -->
      <div
        data-testid="search-backdrop"
        class="search-backdrop"
      />

      <!-- Modal Content -->
      <div
        data-testid="search-modal"
        class="search-modal"
        @click.stop
      >
        <!-- Screen reader only title and description -->
        <h2 id="search-title" class="sr-only">Search Tools</h2>
        <p id="search-description" class="sr-only">
          Type to search through available tools. Use arrow keys to navigate results.
        </p>

        <!-- Search Input -->
        <div class="search-input-container">
          <input
            ref="searchInputRef"
            v-model="searchState.searchQuery.value"
            data-testid="search-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="search-results"
            :aria-activedescendant="selectedItemId"
            placeholder="Search tools..."
            class="search-input"
            @keydown="handleKeyDown"
          />

          <!-- Search Icon -->
          <div class="search-icon">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          <!-- Escape Key Hint -->
          <div class="escape-hint">
            <kbd class="kbd">ESC</kbd>
          </div>
        </div>

        <!-- Search Results -->
        <div
          id="search-results"
          role="listbox"
          aria-label="Search results"
          class="search-results"
        >
          <div
            v-for="(tool, index) in searchState.filteredTools.value"
            :key="tool.id"
            :id="`result-${index}`"
            role="option"
            :aria-selected="navigation.selectedIndex.value === index"
            :data-index="index"
            class="search-result-item"
            :class="getResultItemClasses(index)"
            @click="selectTool(tool)"
            @mouseenter="highlightItem(index)"
          >
            <div class="tool-content">
              <h3 class="tool-name" data-testid="tool-name">{{ tool.name }}</h3>
              <p class="tool-description" data-testid="tool-description">{{ tool.description }}</p>
            </div>

            <!-- Navigation Arrow for Selected Item -->
            <div v-if="navigation.selectedIndex.value === index" class="selection-indicator">
              <svg
                class="w-4 h-4 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <!-- Empty State (No Results) -->
          <div
            v-if="searchState.filteredTools.value.length === 0 && searchState.searchQuery.value.trim()"
            class="no-results"
          >
            <!-- Empty space as per clarifications - no message -->
          </div>
        </div>

        <!-- Results Count for Screen Readers -->
        <div aria-live="polite" aria-atomic="true" class="sr-only">
          {{ searchState.resultsCount.value }} results found
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, watch, ref, toRef } from 'vue'
import { useToolSearch } from '../composables/useToolSearch'
import { useSearchModal } from '../composables/useSearchModal'
import { useKeyboardNavigation } from '../composables/useKeyboardNavigation'
import type { Tool } from '../types/tool'
import type { ToolSearchProps, ToolSearchEmits } from '../types/components'

// Props and Emits
const props = withDefaults(defineProps<ToolSearchProps>(), {
  modelValue: false,
  config: () => ({})
})

const emit = defineEmits<ToolSearchEmits>()

// Composables
const modalState = useSearchModal()
const searchState = useToolSearch(toRef(props, 'tools'), props.config)
const navigation = useKeyboardNavigation(searchState.filteredTools)

// Template refs
const searchInputRef = ref<HTMLInputElement>()

// Assign search input ref to modal state
watch(searchInputRef, (input) => {
  if (input) {
    modalState.searchInput.value = input
  }
})

// Watch modelValue changes
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && !modalState.isOpen.value) {
      openSearch()
    } else if (!isOpen && modalState.isOpen.value) {
      closeSearch()
    }
  }
)

// Watch modal state changes
watch(modalState.isOpen, (isOpen) => {
  emit('update:modelValue', isOpen)

  if (!isOpen) {
    // Reset search and navigation when closing
    searchState.clearSearch()
    navigation.resetSelection()
  }
})

// Computed selected item ID for ARIA
const selectedItemId = computed(() => {
  return navigation.selectedIndex.value >= 0
    ? `result-${navigation.selectedIndex.value}`
    : undefined
})

// Open search function
const openSearch = async (): Promise<void> => {
  await modalState.open()
  navigation.resetSelection()
}

// Close search function
const closeSearch = (): void => {
  modalState.close()
  emit('close')
}

// Handle backdrop click
const handleBackdropClick = (event: Event): void => {
  if (event.target === event.currentTarget) {
    closeSearch()
  }
}

// Handle keyboard navigation
const handleKeyDown = (event: KeyboardEvent): void => {
  switch (event.key) {
    case 'Escape':
      event.preventDefault()
      closeSearch()
      modalState.returnFocus()
      break

    case 'ArrowDown':
      event.preventDefault()
      navigation.selectNext()
      scrollToSelectedItem()
      break

    case 'ArrowUp':
      event.preventDefault()
      navigation.selectPrevious()
      scrollToSelectedItem()
      break

    case 'Enter':
      event.preventDefault()
      const selectedTool = navigation.getSelectedItem(searchState.filteredTools.value)
      if (selectedTool) {
        selectTool(selectedTool)
      }
      break

    case '/':
      // Allow '/' character to be inserted when already in search
      // This implements the clarified behavior from specifications
      break

    default:
      // Reset navigation when typing (user is searching, not navigating)
      if (event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete') {
        navigation.resetSelection()
      }
      break
  }
}

// Select tool function
const selectTool = (tool: Tool): void => {
  emit('select', tool)
  closeSearch()
}

// Highlight item on mouse hover
const highlightItem = (index: number): void => {
  // Set navigation index to follow mouse
  const selectedIndex = ref(index)
  navigation.selectedIndex = selectedIndex as any
}

// Get CSS classes for result items
const getResultItemClasses = (index: number): string[] => {
  const classes = ['search-result-item']

  if (navigation.selectedIndex.value === index) {
    classes.push('selected')
  }

  return classes
}

// Scroll selected item into view
const scrollToSelectedItem = (): void => {
  nextTick(() => {
    const selectedIndex = navigation.selectedIndex.value
    if (selectedIndex >= 0) {
      const selectedElement = document.querySelector(`[data-index="${selectedIndex}"]`)
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    }
  })
}

// Global keyboard shortcut handler
const handleGlobalKeyDown = (event: KeyboardEvent): void => {
  // Only activate search on '/' if not already open and not in an input
  if (
    event.key === '/' &&
    !modalState.isOpen.value &&
    event.target instanceof HTMLElement &&
    !['INPUT', 'TEXTAREA'].includes(event.target.tagName) &&
    !event.target.isContentEditable
  ) {
    event.preventDefault()
    openSearch()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown)
})

// Expose methods for parent components
defineExpose({
  open: openSearch,
  close: closeSearch,
  isOpen: modalState.isOpen
})
</script>

<style scoped>
.search-overlay {
  @apply fixed inset-0 z-50 flex items-start justify-center pt-[20vh];
}

.search-backdrop {
  @apply absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm;
}

.search-modal {
  @apply relative w-full max-w-2xl max-h-[70vh] bg-white rounded-xl shadow-2xl overflow-hidden;
  @apply ring-1 ring-gray-300;
}

.search-input-container {
  @apply relative border-b border-gray-200;
}

.search-input {
  @apply w-full px-4 py-4 pr-20 text-lg placeholder-gray-500 border-0 focus:ring-0 focus:outline-none;
  @apply bg-transparent;
}

.search-icon {
  @apply absolute right-16 top-1/2 transform -translate-y-1/2;
}

.escape-hint {
  @apply absolute right-4 top-1/2 transform -translate-y-1/2;
}

.kbd {
  @apply inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded border;
}

.search-results {
  @apply max-h-96 overflow-y-auto;
}

.search-result-item {
  @apply flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0;
  @apply hover:bg-gray-50 transition-colors duration-150;
}

.search-result-item.selected {
  @apply bg-blue-50 border-blue-200;
}

.tool-content {
  @apply flex-1 min-w-0;
}

.tool-name {
  @apply font-medium text-gray-900 truncate;
}

.tool-description {
  @apply text-sm text-gray-600 truncate mt-1;
}

.selection-indicator {
  @apply flex-shrink-0 ml-3;
}

.no-results {
  @apply h-32; /* Empty space for no results state */
}

.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  .search-overlay {
    @apply pt-4 px-4;
  }

  .search-modal {
    @apply max-w-none;
  }
}
</style>