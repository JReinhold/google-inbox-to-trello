// utility functions for Trello specific features

import { getInboxGlobals } from './dom';
import { getMessageDetails, getUserString } from './inbox';

// extension options specified by user
let defaultBoard: string | undefined;
let defaultList: string | undefined;

chrome.storage.sync.get(items => {
	defaultBoard = items.defaultBoard;
	defaultList = items.defaultList;
});

/**
 * Function to handle clicks on the Trello action button
 * Extracts info from the DOM, and sends a message to the background process, telling it to open a popup
 * @param event ClickEvent on button
 */
export function trelloClickHandler(event: Event) {
	const { permMsgId, subject, isListView } = getMessageDetails(event.target);
	const userString = getUserString();

	//make everything happen in the background process
	chrome.runtime.sendMessage({
		action: 'openTrelloPopup',
		permMsgId,
		userString,
		subject,
		isListView,
		globals: getInboxGlobals(),
	});
}

/**
 * Builds a URL to add a new Trello card
 * From: https://developers.trello.com/v1.0/docs/clientjs#section-using-url-parameters
 * @param title title of the Trello card
 * @param description description of the Trello card
 * @param attachment attachment to add to Trello card
 */
export function buildTrelloPopupUrl(title?: string, attachment?: string) {
	const baseUrl = 'https://trello.com/add-card?';
	const baseParams = '&mode=popup&source=inbox.google.com';
	const titlePart = title ? '&name=' + encodeURIComponent(title) : '';
	const linkPart = attachment ? '&url=' + encodeURIComponent(attachment) : '';
	const boardPart = defaultBoard ? '&idBoard=' + defaultBoard : '';
	const listPart = defaultList ? '&idList=' + defaultList : '';

	return baseUrl + baseParams + titlePart + linkPart + boardPart + listPart;
}
