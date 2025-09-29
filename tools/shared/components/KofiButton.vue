<template>
  <div
    data-testid="kofi-button"
    :class="buttonClasses"
    :aria-hidden="!isVisible"
    :tabindex="isVisible ? 0 : -1"
    aria-label="Support me on Ko-fi"
    role="button"
    @click="handleClick"
  >
    <!-- Ko-fi widget will be inserted here -->
    <div v-if="mounted" :id="kofiContainerId"></div>
    <!-- Fallback button for before Ko-fi widget loads -->
    <button
      v-else
      class="kofi-fallback-button bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg"
      @click="handleFallbackClick"
    >
      ☕ Support Me
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref } from 'vue';
import { useScrollPosition } from '../composables/useScrollPosition';
import type { KofiButtonProps, KofiButtonEmits } from './types';

const props = withDefaults(defineProps<KofiButtonProps>(), {
  threshold: 70,
  animationDuration: 300,
  position: 'bottom-left'
});

const emit = defineEmits<KofiButtonEmits>();

const mounted = ref(false);
const kofiContainerId = `kofi-container-${Math.random().toString(36).substr(2, 9)}`;
const { isAtThreshold, isShortPage } = useScrollPosition(props.threshold);

// Core visibility logic - visible by default, hidden when at threshold
const isVisible = computed(() => isShortPage.value || !isAtThreshold.value);

const buttonClasses = computed(() => {
  const classes = ['kofi-button-wrapper'];

  // Visibility classes
  if (isVisible.value) {
    classes.push('kofi-button-visible');
  } else {
    classes.push('kofi-button-hidden');
  }

  // Position classes
  if (props.position === 'bottom-left') {
    classes.push('kofi-bottom-left');
  } else {
    classes.push('kofi-bottom-right');
  }

  // Transition class
  classes.push('kofi-button-transitioning');

  return classes;
});

const handleClick = () => {
  emit('kofi:clicked');
  // Ko-fi widget handles its own click behavior
};

const handleFallbackClick = () => {
  emit('kofi:clicked');
  // Open Ko-fi page directly if widget hasn't loaded
  window.open(`https://ko-fi.com/${props.kofiUsername}`, '_blank', 'noopener,noreferrer');
};

// Watch for visibility changes
watch(isVisible, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    emit('kofi:shown');
  } else if (!newValue && oldValue) {
    emit('kofi:hidden');
  }
});

// Load Ko-fi widget script
const loadKofiScript = () => {
  if (typeof window === 'undefined') return;

  // Check if script already exists
  if (document.querySelector('script[src*="ko-fi.com"]')) {
    initializeKofiWidget();
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
  script.async = true;
  script.onload = () => {
    initializeKofiWidget();
  };
  script.onerror = () => {
    console.warn('Failed to load Ko-fi widget script');
  };
  document.body.appendChild(script);
};

const initializeKofiWidget = () => {
  if (typeof window === 'undefined' || !(window as any).kofiWidgetOverlay) {
    setTimeout(initializeKofiWidget, 100);
    return;
  }

  try {
    (window as any).kofiWidgetOverlay.draw(props.kofiUsername, {
      'type': 'floating-chat',
      'floating-chat.donateButton.text': 'Support Me',
      'floating-chat.donateButton.backgroundColor': '#00b9fe',
      'floating-chat.donateButton.textColor': '#fff'
    }, kofiContainerId);
  } catch (error) {
    console.warn('Failed to initialize Ko-fi widget:', error);
  }
};

onMounted(() => {
  mounted.value = true;
  loadKofiScript();
});
</script>

<style scoped>
.kofi-button-wrapper {
  position: fixed;
  z-index: 1000;
  transition-property: opacity, transform;
  transition-timing-function: ease-in-out;
}

.kofi-button-transitioning {
  transition-duration: v-bind('`${props.animationDuration}ms`');
}

.kofi-button-hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(20px);
}

.kofi-button-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.kofi-bottom-left {
  bottom: 20px;
  left: 20px;
}

.kofi-bottom-right {
  bottom: 20px;
  right: 20px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .kofi-button-wrapper {
    transition: none !important;
  }

  .kofi-button-hidden,
  .kofi-button-visible {
    transform: none !important;
  }
}

/* Override Ko-fi widget styles if needed */
:deep(.floatingchat-container) {
  margin: 0 !important;
}

/* Fallback button styling */
.kofi-fallback-button {
  @apply transition-colors duration-200;
}

.kofi-fallback-button:focus {
  @apply outline-none ring-2 ring-blue-400 ring-opacity-50;
}
</style>