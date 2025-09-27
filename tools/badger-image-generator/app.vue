<template>
  <div>
    <NuxtPage />

    <!-- Ko-fi Widget Container (for testing) -->
    <div v-if="kofiWidget.state.value.isVisible" data-testid="kofi-widget" class="kofi-widget-container"></div>
  </div>
</template>

<script setup lang="ts">
import { useKofiWidget } from '../shared/composables/useKofiWidget'
import KOFI_CONFIG from '../shared/config/kofi'

// Initialize Ko-fi widget
const kofiWidget = useKofiWidget()

onMounted(() => {
  kofiWidget.init(KOFI_CONFIG)
  kofiWidget.load()
})
</script>