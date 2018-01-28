import { createToolbarButton } from './toolbar-button';
import { buildTrelloButton } from './utils';
import { trelloClickHandler } from './trello-integration';
import * as _ from 'lodash';
import { attachElemToAll, getInboxGlobals } from './utils/dom';
require('arrive');

const ITEM_ACTIONS_SELECTOR = 'ul.iK:not([aria-label="Bundle actions"])';
const MESSAGE_LIST_SELECTOR = '.tE';

// add Trello button on first render
attachElemToAll(buildTrelloButton(), ITEM_ACTIONS_SELECTOR, {
	prepend: true,
	once: 'trelloAttached',
});
// add click listener to first render buttons
const trelloBtns = document.querySelectorAll('.itemIconTrello');
for (let i = 0; i < trelloBtns.length; i++) {
	trelloBtns[i].addEventListener('click', trelloClickHandler);
}

// add Trello button everytime a new actions toolbar is created in the DOM
const messageList = document.querySelector<WithArrive>(MESSAGE_LIST_SELECTOR)!;
messageList.arrive(ITEM_ACTIONS_SELECTOR, (actionToolbar: HTMLElement) => {
	const trelloBtn = buildTrelloButton();
	// add to start of newly created ul
	actionToolbar.insertBefore(trelloBtn, actionToolbar.firstChild);
	trelloBtn.addEventListener('click', trelloClickHandler);
});

// read global variables created by Google Inbox
getInboxGlobals();
