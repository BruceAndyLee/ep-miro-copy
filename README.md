# Template project to learn something about react and its infra

Killer libs:

- msw - for serviceWorker based http interception. Makes the front think it's talking to a real backend over real https
- openapi-msw - open-api based schema consumer for typed mock server powered by msw

## Memos

generate a service worker under the /public directory so that the front can load it from browser as a static file
```bash
npx msw init public --save
```

