import type { Tool } from '../types/tool'

/**
 * Build the landing-page tool catalog for the current environment.
 * The catalog is intentionally pure so URL and badge behavior can be unit tested.
 */
export function buildToolCatalog(isDevEnvironment: boolean): Tool[] {
  const getToolUrl = (toolName: string): string => {
    return isDevEnvironment
      ? `https://${toolName}.dev.devtools.site`
      : `https://${toolName}.devtools.site`
  }

  return [
    {
      id: 'hash-generator',
      name: 'Hash Generator',
      description: 'Generate SHA-256, SHA-1, MD5, and SHA-512 hashes from text input',
      icon: '#',
      url: getToolUrl('hash-generator'),
      tags: ['hash', 'crypto', 'security', 'sha256', 'md5'],
    },
    {
      id: 'qr-generator',
      name: 'QR Code Generator',
      description: 'Generate QR codes from text, URLs, or any content with customizable options',
      icon: '⬛',
      url: getToolUrl('qr-generator'),
      tags: ['qr', 'code', 'generator', 'url', 'mobile'],
    },
    {
      id: 'unix-time-converter',
      name: 'Unix Time Converter',
      description: 'Convert between Unix timestamps and human-readable dates',
      icon: '🕐',
      url: getToolUrl('unix-time-converter'),
      tags: ['unix', 'time', 'timestamp', 'date', 'convert'],
    },
    {
      id: 'password-generator',
      name: 'Password Generator',
      description: 'Generate secure passwords with customizable options',
      icon: '🔐',
      url: getToolUrl('password-generator'),
      tags: ['password', 'security', 'generator', 'random', 'secure'],
    },
    {
      id: 'ip-calculator',
      name: 'IP Calculator',
      description: 'Calculate subnet masks, network addresses, and IP ranges',
      icon: '🌐',
      url: getToolUrl('ip-calculator'),
      tags: ['ip', 'network', 'subnet', 'cidr', 'calculator'],
    },
    {
      id: 'markdown-preview',
      name: 'Markdown Preview',
      description: 'Preview Markdown files with live rendering and syntax highlighting',
      icon: '📋',
      url: getToolUrl('markdown-preview'),
      tags: ['markdown', 'preview', 'editor', 'rendering', 'docs'],
    },
    {
      id: 'placeholder-generator',
      name: 'Placeholder Generator',
      description: 'Generate custom placeholder images with various sizes and colors',
      icon: '🖼️',
      url: getToolUrl('placeholder-generator'),
      tags: ['placeholder', 'image', 'generator', 'design', 'mockup'],
    },
    {
      id: 'ip-info',
      name: 'IP Info',
      description: 'Display your IP address information including location and ISP details',
      icon: '🌍',
      url: getToolUrl('ip-info'),
      tags: ['ip', 'info', 'location', 'isp', 'geolocation'],
    },
    {
      id: 'timezone-converter',
      name: 'Timezone Converter',
      description: 'Convert time between different timezones with world clock display',
      icon: '🌐',
      url: getToolUrl('timezone-converter'),
      tags: ['timezone', 'time', 'convert', 'world', 'clock'],
    },
    {
      id: 'string-converter',
      name: 'String Converter',
      description:
        'Convert strings between formats: Base64, URL encoding, case conversion and more',
      icon: '🔤',
      url: getToolUrl('string-converter'),
      tags: ['string', 'convert', 'base64', 'url', 'encoding'],
    },
    {
      id: 'code-diff',
      name: 'Code Diff',
      description: 'Compare and visualize differences between text files or code snippets',
      icon: '📊',
      url: getToolUrl('code-diff'),
      tags: ['diff', 'compare', 'code', 'text', 'merge'],
    },
    {
      id: 'mic-test',
      name: 'Mic Test',
      description:
        'Test your microphone by recording and playing back audio to verify it works correctly',
      icon: '🎤',
      url: getToolUrl('mic-test'),
      tags: ['microphone', 'audio', 'test', 'recording', 'voice'],
    },
    {
      id: 'json-yaml-converter',
      name: 'JSON/YAML Converter',
      description: 'Convert between JSON, YAML, and TOML formats with validation and formatting',
      icon: '📝',
      url: getToolUrl('json-yaml-converter'),
      tags: ['json', 'yaml', 'toml', 'convert', 'format'],
    },
    {
      id: 'jwt-decoder',
      name: 'JWT Decoder',
      description: 'Decode and validate JSON Web Tokens with detailed information display',
      icon: '🔍',
      url: getToolUrl('jwt-decoder'),
      tags: ['jwt', 'token', 'decode', 'auth', 'security'],
    },
    {
      id: 'regex-tester',
      name: 'Regex Tester',
      description:
        'Test and validate regular expressions with live matching and detailed explanations',
      icon: '✅',
      url: getToolUrl('regex-tester'),
      tags: ['regex', 'pattern', 'test', 'match', 'validation'],
    },
    {
      id: 'lorem-ipsum-generator',
      name: 'Lorem Ipsum Generator',
      description: 'Generate placeholder text for your projects with customizable options',
      icon: '📄',
      url: getToolUrl('lorem-ipsum-generator'),
      tags: ['lorem', 'ipsum', 'text', 'placeholder', 'content'],
    },
    {
      id: 'image-converter',
      name: 'Image Converter',
      description: 'Convert image formats and resize images with quality controls',
      icon: '🖼️',
      url: getToolUrl('image-converter'),
      tags: ['image', 'convert', 'resize', 'format', 'quality'],
    },
    {
      id: 'timer',
      name: 'Timer',
      description: 'Countdown timer, stopwatch, and Pomodoro technique timer for productivity',
      icon: '⏱️',
      url: getToolUrl('timer'),
      tags: ['timer', 'countdown', 'stopwatch', 'pomodoro', 'productivity'],
    },
    {
      id: 'character-code-converter',
      name: 'Character Code Converter',
      description:
        'Convert characters to various encoding formats including ASCII, Unicode, UTF-8, and more',
      icon: '🔢',
      url: getToolUrl('character-code-converter'),
      tags: ['character', 'ascii', 'unicode', 'utf8', 'encoding'],
    },
    {
      id: 'badger-image-generator',
      name: 'Badger2040 Image Generator',
      description:
        'Generate 296x128 pixel monochrome images for Badger2040 e-ink display with text and formatting options',
      icon: '🦡',
      url: getToolUrl('badger-image-generator'),
      tags: ['badger2040', 'eink', 'display', 'monochrome', 'embed'],
    },
    {
      id: 'poster-splitter',
      name: 'Poster Splitter',
      description: 'Split A3 images and PDFs into A4 pages for easy printing on standard printers',
      icon: '📐',
      url: getToolUrl('poster-splitter'),
      tags: ['poster', 'split', 'print', 'a3', 'a4'],
    },
    {
      id: 'map-distance-calculator',
      name: 'Map Distance Calculator',
      description: 'Calculate great-circle distance and bearing between two points on a map',
      icon: '🗺️',
      url: getToolUrl('map-distance-calculator'),
      tags: ['map', 'distance', 'bearing', 'geolocation', 'coordinates'],
    },
    {
      id: 'amazon-url-normalizer',
      name: 'Amazon URL Normalizer',
      description: 'Clean and shorten Amazon product URLs by removing tracking parameters',
      icon: '🔗',
      url: getToolUrl('amazon-url-normalizer'),
      tags: ['amazon', 'url', 'asin', 'normalize', 'shortener', 'clean'],
    },
    {
      id: 'notes',
      name: 'AI Notes',
      description: 'AI-powered note-taking app with folder organization and smart features',
      icon: '📝',
      url: getToolUrl('notes'),
      tags: ['notes', 'ai', 'markdown', 'organization', 'productivity'],
    },
    {
      id: 'version-checker',
      name: 'Version Checker',
      description: 'Open the Version Checker service',
      icon: '🔖',
      url: 'https://version-checker.dev.devtools.site',
      tags: ['version', 'checker'],
      ...(isDevEnvironment ? {} : { statusLabel: 'PRD -> DEV', statusVariant: 'warning' as const }),
    },
    {
      id: 'easy-print',
      name: 'Easy Print',
      description: 'Open the Easy Print service',
      icon: '🖨️',
      url: isDevEnvironment
        ? 'https://easy-print.dev.devtools.site'
        : 'https://easy-print.devtools.site',
      tags: ['easy', 'print'],
      statusLabel: 'Coming Soon',
      statusVariant: 'warning' as const,
    },
    {
      id: 'oil-dashboard',
      name: 'Oil Dashboard',
      description: 'Open the Oil Dashboard service',
      icon: '🛢️',
      url: isDevEnvironment
        ? 'https://oil-dashboard.dev.devtools.site'
        : 'https://oil-dashboard.devtools.site',
      tags: ['oil', 'dashboard'],
    },
    {
      id: 'code-map',
      name: 'Code Map',
      description: 'Open the Code Map service',
      icon: '🗺️',
      url: 'https://codemap.dev.devtools.site',
      tags: ['code', 'map'],
      ...(isDevEnvironment ? {} : { statusLabel: 'PRD -> DEV', statusVariant: 'warning' as const }),
    },
    {
      id: 'routine-ops',
      name: 'RoutineOps',
      description: 'Open the RoutineOps service',
      icon: '🧭',
      url: isDevEnvironment
        ? 'https://routine.dev.devtools.site/'
        : 'https://routine.devtools.site/',
      tags: ['routine', 'ops'],
    },
    {
      id: 'yoyaku-kun',
      name: 'AI Summarizer',
      description:
        'LINE bot that summarizes URLs and text into concise Japanese summaries using AI',
      icon: '🤖',
      url: 'https://line.me/R/ti/p/@390decxm',
      tags: ['line', 'bot', 'ai', 'summary', 'url', 'text'],
    },
  ]
}
