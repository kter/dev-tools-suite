#!/bin/bash

# Script to integrate Ko-fi widget into all dev tools
# This automates the integration process for the remaining tools

echo "🚀 Starting Ko-fi widget integration for all tools..."

# List of all tools (excluding landing-page and hash-generator which are already done)
TOOLS=(
    "qr-generator"
    "unix-time-converter"
    "password-generator"
    "string-converter"
    "character-code-converter"
    "json-yaml-converter"
    "image-converter"
    "timezone-converter"
    "ip-calculator"
    "ip-info"
    "jwt-decoder"
    "regex-tester"
    "code-diff"
    "lorem-ipsum-generator"
    "placeholder-generator"
    "badger-image-generator"
    "markdown-preview"
    "poster-splitter"
    "mic-test"
    "timer"
)

for tool in "${TOOLS[@]}"; do
    echo "📝 Integrating Ko-fi widget into $tool..."

    APP_FILE="/Users/ttakahashi/workspace/dev-tools-suite/tools/$tool/app.vue"

    if [ -f "$APP_FILE" ]; then
        # Add imports after existing imports
        sed -i '' '/^<script setup lang="ts">/a\
import { useKofiWidget } from '\''~/shared/composables/useKofiWidget'\''\
import KOFI_CONFIG from '\''~/shared/config/kofi'\''
' "$APP_FILE"

        # Add Ko-fi widget initialization after dark mode initialization
        sed -i '' '/const { initializeTheme } = useDarkMode()/a\
\
// Initialize Ko-fi widget\
const kofiWidget = useKofiWidget()
' "$APP_FILE"

        # Add Ko-fi initialization to onMounted
        if grep -q "onMounted(() => {" "$APP_FILE"; then
            sed -i '' '/onMounted(() => {/a\
  kofiWidget.init(KOFI_CONFIG)\
  kofiWidget.load()
' "$APP_FILE"
        else
            # Create onMounted if it doesn't exist
            sed -i '' '/initializeTheme()/a\
\
onMounted(() => {\
  kofiWidget.init(KOFI_CONFIG)\
  kofiWidget.load()\
})
' "$APP_FILE"
        fi

        # Add Ko-fi widget container before closing </template>
        sed -i '' '/<\/template>/i\
\
    <!-- Ko-fi Widget Container (for testing) -->\
    <div v-if="kofiWidget.state.value.isVisible" data-testid="kofi-widget" class="kofi-widget-container"></div>
' "$APP_FILE"

        echo "✅ $tool integration complete"
    else
        echo "❌ $tool app.vue not found at $APP_FILE"
    fi
done

echo "🎉 Ko-fi widget integration completed for all tools!"