# Old YouTube Subscriptions List (Firefox)

MVP Firefox add-on that forces the YouTube subscriptions feed into a single-column vertical list.

## Scope

- Active only on `https://www.youtube.com/feed/subscriptions*`
- Always on (no popup or toggle)
- Designed for personal use MVP

## Load in Firefox (temporary)

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select `manifest.json` from this folder
4. Open `https://www.youtube.com/feed/subscriptions`

## Notes

- YouTube is a SPA and frequently changes markup; this add-on uses route listeners + mutation observation to re-apply list layout.
- If YouTube updates break selectors, adjust `src/content/subscriptions-list.css` and `src/content/subscriptions-list.js`.
