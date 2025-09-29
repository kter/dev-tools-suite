# Page snapshot

```yaml
- button "💻 System"
- heading "QR Code Generator" [level=1]
- paragraph: Generate QR codes from text, URLs, or any content instantly
- text: Enter text or URL
- textbox "Enter text or URL"
- text: Error Correction Level
- combobox:
  - option "Low (7%)"
  - option "Medium (15%)" [selected]
  - option "Quartile (25%)"
  - option "High (30%)"
- text: QR Code Size
- combobox:
  - option "Small (200x200)"
  - option "Medium (300x300)" [selected]
  - option "Large (400x400)"
  - option "Extra Large (500x500)"
- heading "How to use" [level=2]
- paragraph: Enter any text, URL, or content in the text area above to instantly generate a QR code.
- heading "📱 Website URLs" [level=3]
- paragraph: https://example.com
- heading "📧 Email Address" [level=3]
- paragraph: mailto:user@example.com
- heading "📞 Phone Number" [level=3]
- paragraph: tel:+1234567890
- heading "💬 Plain Text" [level=3]
- paragraph: Any text content
- button "Support me on Ko-fi":
  - iframe
  - img
  - img
```