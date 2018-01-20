import { createToolbarButton } from './toolbar-button';
import { attachElemToAll, buildTrelloButton } from './utils';
require('arrive');

const ITEM_ACTIONS_SELECTOR = 'ul.iK:not([aria-label="Bundle actions"])';

// add Trello button on first render
attachElemToAll(buildTrelloButton(), ITEM_ACTIONS_SELECTOR, {
	prepend: true,
	once: 'trelloAttached',
});

// add Trello button everytime a new actions list is created in the DOM
const messageList = document.querySelector<WithArrive>('.tE')!;
messageList.arrive(ITEM_ACTIONS_SELECTOR, (actionToolbar: HTMLElement) => {
	console.log('created', actionToolbar);
	// add to start of newly created ul
	actionToolbar.insertBefore(buildTrelloButton(), actionToolbar.firstChild);
});
