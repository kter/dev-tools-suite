/**
 * Ko-fi Widget Configuration
 * Shared configuration used across all dev tools
 */

import type { KofiWidgetConfig } from '../types/kofi'

export const KOFI_CONFIG: KofiWidgetConfig = {
  accountId: 'kterr',
  type: 'floating-chat',
  buttonText: 'Support me',
  backgroundColor: '#00b9fe',
  textColor: '#fff'
}

/**
 * Default Ko-fi widget configuration
 * Use this in all tools for consistency
 */
export default KOFI_CONFIG