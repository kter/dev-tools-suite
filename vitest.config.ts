import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  esbuild: {
    // Prevent esbuild from picking up Nuxt-generated tsconfigs in tool subdirectories
    tsconfigRaw: {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        moduleResolution: 'bundler',
        esModuleInterop: true,
        strict: true,
      }
    }
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['tools/*/utils/**/*.ts', 'tools/shared/utils/**/*.ts'],
    }
  },
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'tools/shared')
    }
  }
})
