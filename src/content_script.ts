import { buildTrelloButton } from './utils';
import * as _ from 'lodash';
import { attachElemToAll, getInboxGlobals } from './utils/dom';
import { trelloClickHandler } from './utils/trello';
require('arrive');

const ITEM_ACTIONS_SELECTOR = 'ul.iK:not([aria-label="Bundle actions"])';
const MESSAGE_LIST_SELECTOR = '.tE';

// read global variables created by Google Inbox
getInboxGlobals();

// add Trello button on first render
attachElemToAll(buildTrelloButton(), ITEM_ACTIONS_SELECTOR, {
	prepend: true,
	once: 'trelloAttached',
});
// add click listener to first render buttons
const trelloBtns = document.querySelectorAll('.itemIconTrello');
Array.from(trelloBtns).forEach(trelloBtn =>
	trelloBtn.addEventListener('click', trelloClickHandler),
);

// add Trello button everytime a new actions toolbar is created in the DOM
const messageList = document.querySelector<WithArrive>(MESSAGE_LIST_SELECTOR);
if (messageList) {
	messageList.arrive(ITEM_ACTIONS_SELECTOR, (actionToolbar: HTMLElement) => {
		const trelloBtn = buildTrelloButton();
		// add to start of newly created ul
		actionToolbar.insertBefore(trelloBtn, actionToolbar.firstChild);
		trelloBtn.addEventListener('click', trelloClickHandler);
	});
} else {
	throw new Error(`
	extension: google-inbox-to-trello:
	the MessageList element could not be found, can't attach Trello button to toolbars.
	Try reloading the page.
	If this keeps happening, please file an issue at https://github.com/JReinhold/google-inbox-to-trello/issues`);
}
