# Ello Messenger Web

## Local setup

```sh
mv .env.example .env
npm i
```

Populate the `.env` file according to your server configuration:

- SERVER_KEY_F
- SERVER_KEY_N
- SERVER_KEY_E

## Dev mode

```sh
npm run dev
```

### Invoking API from console

Start your dev server and locate GramJS worker in console context.

All constructors and functions available in global `GramJs` variable.

Run `npm run gramjs:tl full` to get access to all available Telegram requests.

Example usage:

```javascript
await invoke(new GramJs.help.GetAppConfig());
```

## Requirements for build

- Node.js 18+
- yarn
