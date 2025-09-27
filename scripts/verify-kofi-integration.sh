#!/bin/bash

# Script to verify Ko-fi widget integration across all tools
echo "🔍 Verifying Ko-fi widget integration across all 22 tools..."

# List of all tools including landing-page
TOOLS=(
    "landing-page"
    "hash-generator"
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

SUCCESS_COUNT=0
FAIL_COUNT=0

for tool in "${TOOLS[@]}"; do
    echo "📝 Checking $tool..."

    APP_FILE="/Users/ttakahashi/workspace/dev-tools-suite/tools/$tool/app.vue"

    if [ -f "$APP_FILE" ]; then
        # Check for Ko-fi imports
        if grep -q "useKofiWidget" "$APP_FILE" && grep -q "KOFI_CONFIG" "$APP_FILE"; then
            # Check for initialization
            if grep -q "kofiWidget.init(KOFI_CONFIG)" "$APP_FILE" && grep -q "kofiWidget.load()" "$APP_FILE"; then
                # Check for testid
                if grep -q 'data-testid="kofi-widget"' "$APP_FILE"; then
                    echo "✅ $tool - Ko-fi integration complete"
                    ((SUCCESS_COUNT++))
                else
                    echo "⚠️  $tool - Missing data-testid"
                    ((FAIL_COUNT++))
                fi
            else
                echo "❌ $tool - Missing initialization"
                ((FAIL_COUNT++))
            fi
        else
            echo "❌ $tool - Missing imports"
            ((FAIL_COUNT++))
        fi
    else
        echo "❌ $tool - app.vue not found"
        ((FAIL_COUNT++))
    fi
done

echo ""
echo "📊 Integration Summary:"
echo "✅ Successful integrations: $SUCCESS_COUNT"
echo "❌ Failed integrations: $FAIL_COUNT"
echo "📈 Success rate: $(( SUCCESS_COUNT * 100 / (SUCCESS_COUNT + FAIL_COUNT) ))%"

if [ $FAIL_COUNT -eq 0 ]; then
    echo "🎉 All tools have consistent Ko-fi widget integration!"
    exit 0
else
    echo "⚠️  Some tools need attention"
    exit 1
fi