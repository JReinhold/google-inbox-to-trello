# Inbox to Trello Extension
Extension that enables you to quickly create a new Trello card from a reminder, mail or thread in Google Inbox.

![Demo GIF](images/demo-v1.1.0.gif)

## Purpose

The purpose of this Chrome and Firefox extension is to make it easy to create Trello cards from e-mails and reminders. The Trello Card will contain a link back to the original mail, with the subject as the title.

The extension is inspired by [this Medium article](https://praxis.fortelabs.co/one-touch-to-inbox-zero-a74cfa02e5bf) by [Tiago Forte](https://praxis.fortelabs.co/@fortelabs), that thoroughly explains why it's important to easily be able to move your e-mails to a todo list, and just as important why it should always contain a link back to the original mail.

## Installation

### Chrome Web Store

The extension is available on the official Chrome Web Store [here](https://chrome.google.com/webstore/detail/google-inbox-to-trello/dpljfgaohddbpfhbkpejaacmbfmbenmm). Just press the *Add to Chrome* button, reload your Google Inbox tab and you are ready to go.

### Firefox Add-ons

The extension is available on the official Firefox Add-ons site [here](https://addons.mozilla.org/firefox/addon/google-inbox-to-trello/). Just press the *Add to Firefox* button, reload your Google Inbox tab and you are ready to go.

## Usage

Once installed, the extension puts a small Trello button on the right side of the e-mails and reminders, next to the regular Done, Pin, Delete, etc. buttons.
Pressing the button will trigger a pop-up, where you specify which Trello board and list to create the card on. Optionally you can edit the title and description of the card. Press "Send to..." and have a great day.

### Options

On [chrome://extensions](chrome://extensions) and [about:addons](about:addons) (Firefox)  it is possible to define a few options:
- **Default board ID** - The default board to add the card to. Get the board ID by visiting the board ind Trello and copying the string just after `https://trello.com/b/`
- **Default list ID** - The default list to add the card to. Get the list ID by visiting [https://trello.com/b/\<BOARD-ID\>/reports.json](https://trello.com/b/<BOARD-ID>/reports.json). Search for the list name, and copy the `id` just after that.

## Roadmap

I have received a few suggenstions for improvements that would be cool to make. The roadmap is subject to change by the minute, and any suggestions are welcome.

- [x] First working MVP to validate the idea
- [ ] Port WebExtension to support:
  - [x] Chrome
  - [x] Firefox
  - [ ] Safari
  - [ ] Edge
  - [ ] More?
- [ ] "Quick button" that instantly creates card in predefined board+list
- [ ] Auto-archive mails on card creation
- [x] Support links back to Inbox, not just Gmail
- [ ] Add mail attachments and images to Trello Card
- [ ] Advanced configuration of cards with Labels, Members, etc.

## Contributing

Ideas and feedback are ALWAYS welcome, just submit an issue.
Pull Requests are also very welcome.

The extension is developed using [TypeScript](https://www.typescriptlang.org) and [Webpack](https://webpack.js.org/), formatted with [Prettier](https://prettier.io/), linted with [TSLint](https://palantir.github.io/tslint/) and developed with love ❤️.

The file structure follows a classic WebExtension structure, a quick Google search should explain it. Have a look in `manifest.json` to get an overview.

### Development

1. Have [Node.js](https://github.com/nodejs/node) and optionally [Yarn](https://github.com/yarnpkg/yarn) installed
2. Clone this repo
3. Run `yarn install` or `npm install`

#### Chrome

4. Run `yarn dev` or `npm run dev`, which builds to a `build` folder in the project root and watches for changes.
5. Go to [chrome://extensions](chrome://extensions), Click *Load unpacked extension...* and point it to the previously created `build` folder.
6. Submit awesome PRs.

#### Firefox

4. Run `yarn dev:firefox` or `npm run dev:firefox`, which builds to a `build` folder in the project root, watches for changes and loads the extension in a new Firefox window.
6. Submit awesome PRs.
