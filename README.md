# Inbox to Trello Extension
Extension that enables you to quickly create a new Trello card from a reminder, mail or thread in Google Inbox.

![Demo GIF](images/demo-v1.1.0.gif)

## Purpose

The purpose of this Chrome extension is to make it easy to create Trello cards from e-mails and reminders. The Trello Card will contain a link back to the original mail, with the subject as the title.

The extension is inspired by [this Medium article](https://praxis.fortelabs.co/one-touch-to-inbox-zero-a74cfa02e5bf) by [Tiago Forte](https://praxis.fortelabs.co/@fortelabs), that thoroughly explains why it's important to easily be able to move your e-mails to a todo list, and just as important why it should always contain a link back to the original mail.
## Installation

### Chrome Web Store

The extension is available on the official Chrome Web Store [here](https://chrome.google.com/webstore/detail/google-inbox-to-trello/dpljfgaohddbpfhbkpejaacmbfmbenmm). Just press the *Add to Chrome* button, reload your Google Inbox tab, and you are ready to go.

### From source

To install the extension directly from source do:

1. Have [Node.js](https://github.com/nodejs/node) and optionally [Yarn](https://github.com/yarnpkg/yarn) installed
2. Clone this repo
3. Run `yarn install` or `npm install`
4. Run `yarn build` or `npm run build`, which builds to a `build` folder in the project root.
5. Go to [chrome://extensions](chrome://extensions), Click *Load unpacked extension...* and point it to the previously created `build` folder.
6. Submit awesome PRs.

## Usage

Once installed, the extension puts a small Trello button on the right side of the e-mails, next to the regular Done, Pin, Delete, etc. buttons.
Pressing the button will trigger a pop-up, where you specify which Trello board and list to create the card on. Optionally you can edit the title and description of the card. Press "Send to...", and have a great day.

### Options

On [chrome://extensions](chrome://extensions) it is possible to define a few options:
- **Default board ID** - The default board to add the card to. Get the board ID by visiting the board and copying the string just after `trello.com/b/`
- **Default list ID** - The default list to add the card to. Get the list ID by visiting [https://trello.com/b/\<BOARD-ID\>/reports.json](https://trello.com/b/<BOARD-ID>/reports.json). Search for the list name, and copy the `id` just after that.

## Roadmap

If I ever find this useful, I have a few improvements I would like to make. The roadmap is subject to change by the minute, and any suggestions are welcome.

- [x] First working MVP to validate the idea
- [ ] Port to WebExtension to support Firefox, Safari, Edge and possibly more.
- [ ] Quick option that instantly creates card in predefined board+list
- [ ] Auto-archive mails on card creation
- [x] Support links back to Inbox, not just Gmail
- [ ] Add mail attachments and images to Trello Card
- [ ] Advanced configuration of cards with Labels, Members, etc.

## Contributing

Ideas and feedback are ALWAYS welcome, just submit an issue.
Pull Requests are also very welcome.

The extension is developen using TypeScript and Webpack, formatted with Prettier, linted with TSLint and developed with love.

- `yarn dev` - Start a webpack watcher that automatically rebuilds on file changes. Remember to reload the Extensions page each time you have an update.
- `yarn build` - Builds the source to the `build` directory.

The file structure follows a classic WebExtension structure, a quick Google search should explain it. Have a look in `assets/manifest.json` to get an overview.
