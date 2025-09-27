/**
 * Ko-fi Widget Types
 * Shared TypeScript interfaces for Ko-fi widget integration
 */

export interface KofiWidgetConfig {
  accountId: string;
  type: 'floating-chat';
  buttonText: string;
  backgroundColor: string;
  textColor: string;
}

export interface KofiWidgetState {
  isLoaded: boolean;
  isVisible: boolean;
  loadError: boolean;
}

export interface UseKofiWidget {
  /**
   * Initialize Ko-fi widget with configuration
   * @param config - Widget configuration object
   */
  init(config: KofiWidgetConfig): void;

  /**
   * Current widget state (reactive)
   */
  readonly state: Readonly<Ref<KofiWidgetState>>;

  /**
   * Load Ko-fi script and initialize widget
   * Returns promise that resolves when script loads or fails
   */
  load(): Promise<void>;

  /**
   * Manually hide widget (for error states)
   */
  hide(): void;

  /**
   * Manually show widget (if script loaded successfully)
   */
  show(): void;
}