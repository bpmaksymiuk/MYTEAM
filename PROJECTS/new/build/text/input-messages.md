# Input Messages — ViralReword

## Input Textarea Placeholder

```
Paste your text here — 50 to 10,000 characters.
```

## Character Counter (below textarea)

```
{N} / 10,000
```

- When N < 50: display in amber (`--color-warning`).
- When N > 10,000: display in red (`--color-danger`).
- Otherwise: display in muted text (`--color-text-muted`).

## Submit Button Label

```
Rewrite
```

## Validation Error Messages

| Condition | Message |
|-----------|---------|
| Input fewer than 50 characters | Your text needs to be at least 50 characters. |
| Input more than 10,000 characters | Your text is over the 10,000 character limit. |
| No strategies selected (edge case) | Select at least one strategy to rewrite. |
| Network error during submit | Something went wrong. Please try again. |

## Thread Mode Prompt Banner (input > 280 chars)

```
Your text is {N} characters — Switch to Thread mode to split it into a thread.
```

Link label: `Switch to Thread mode →`
