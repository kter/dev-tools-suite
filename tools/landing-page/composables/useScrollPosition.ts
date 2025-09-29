import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';

interface ScrollPositionReturn {
  scrollPercentage: Ref<number>;
  isAtThreshold: Ref<boolean>;
  isShortPage: Ref<boolean>;
  cleanup: () => void;
}

export function useScrollPosition(threshold: number = 70): ScrollPositionReturn {
  const scrollPercentage = ref(0);
  const isAtThreshold = ref(false);
  const isShortPage = ref(false);

  let scrollTimer: NodeJS.Timeout | null = null;
  let resizeTimer: NodeJS.Timeout | null = null;

  const calculateScrollPercentage = (): void => {
    const scrollY = window.scrollY || window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollableHeight = documentHeight - windowHeight;

    // Check if page is too short to scroll
    if (scrollableHeight <= 0) {
      scrollPercentage.value = 0;
      isShortPage.value = true;
      isAtThreshold.value = false;
      return;
    }

    isShortPage.value = false;

    // Calculate percentage
    const percentage = Math.min(100, Math.max(0, (scrollY / scrollableHeight) * 100));
    scrollPercentage.value = percentage;

    // Check if at threshold
    isAtThreshold.value = percentage >= threshold;
  };

  const throttledScrollHandler = (): void => {
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }

    scrollTimer = setTimeout(() => {
      calculateScrollPercentage();
    }, 100); // Throttle to 100ms
  };

  const handleResize = (): void => {
    if (resizeTimer) {
      clearTimeout(resizeTimer);
    }

    resizeTimer = setTimeout(() => {
      calculateScrollPercentage();
    }, 100);
  };

  const cleanup = (): void => {
    window.removeEventListener('scroll', throttledScrollHandler);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);

    if (scrollTimer) {
      clearTimeout(scrollTimer);
      scrollTimer = null;
    }

    if (resizeTimer) {
      clearTimeout(resizeTimer);
      resizeTimer = null;
    }
  };

  onMounted(() => {
    // Initial calculation
    calculateScrollPercentage();

    // Add event listeners with passive option for better performance
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
  });

  onUnmounted(() => {
    cleanup();
  });

  return {
    scrollPercentage,
    isAtThreshold,
    isShortPage,
    cleanup
  };
}