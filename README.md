# obsidian-todays-link

This is a plugin for Obsidian (https://obsidian.md) which makes it easier to insert links for today's daily note into your file! It adds a command and an inline text shortcut which both add a link to today's daily note to your file. It integrates with (and depends on) the daily notes core plugin to find the expected format of daily notes.

To insert a link to today's daily note, simply enable this plugin and type `[[today]]` - the plugin will replace it with a link to today's daily note. Alternatively, use the `Add link to today's daily note at cursor` command.

This project uses TypeScript to provide type checking and documentation.
The repo depends on the latest plugin API (obsidian.d.ts) in TypeScript Definition format, which contains TSDoc comments describing what it does.

## How to install

- Clone this repo.
- Make sure your NodeJS is at least v16 (`node --version`).
- `npm i` or `yarn` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/obsidian-todays-link/`.
