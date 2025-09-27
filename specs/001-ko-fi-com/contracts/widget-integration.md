# Widget Integration Contract

## Tool Integration Requirements

Each tool MUST:

1. **Import composable**: `const { init, state, load } = useKofiWidget()`
2. **Initialize on mount**: Call `init()` with standard configuration
3. **Load widget**: Call `load()` after page is ready
4. **Handle errors gracefully**: Widget hides automatically on load failure

## Configuration Contract

All tools MUST use identical configuration:

```typescript
const CONFIG = {
  accountId: 'kterr',
  type: 'floating-chat',
  buttonText: 'Support me',
  backgroundColor: '#00b9fe',
  textColor: '#fff'
}
```

## Positioning Contract

Widget MUST:
- Use Ko-fi's default floating chat position
- Not be modified per-tool
- Not interfere with tool functionality
- Maintain consistent position across all 22 applications

## Error Handling Contract

When Ko-fi service is unavailable:
- Widget MUST hide completely (no visual trace)
- No error messages displayed to users
- Tool functionality MUST remain unaffected
- Silent logging acceptable for debugging

## Testing Contract

Each tool's E2E test MUST verify:
- Widget appears when Ko-fi service available
- Widget does not break tool functionality
- Widget maintains consistent positioning