import { createToolbarButton } from './toolbar-button';
import { attachElemToAll, buildTrelloButton } from './utils';

// initialize everything
// (async function() {
// initialize the SDK
// const sdk = await InboxSDK.load(2, 'sdk_mail-to-trello_a09aea7b41');
// sdk.Toolbars.registerThreadButton(createToolbarButton());
// })();

attachElemToAll(buildTrelloButton(), 'ul.iK', { prepend: true });
