// utility functions for Trello specific features

import { getInboxGlobals } from './dom';
import { getMessageDetails, getUserString } from './inbox';
import { crossBrowser } from './browser';

// extension options specified by user
let defaultBoard: string | undefined;
let defaultList: string | undefined;

/**
 * Function to handle clicks on the Trello action button
 * Extracts info from the DOM, and sends a message to the background process, telling it to open a popup
 * @param event ClickEvent on button
 */
export function trelloClickHandler(event: Event) {
	const button = event.target as HTMLLIElement;
	// add circle style, and remove it again after 500ms
	button.classList.add('ar');
	setTimeout(() => button.classList.remove('ar'), 500);

	const { permMsgId, subject, viewType, contentType } = getMessageDetails(button);
	const userString = getUserString();

	const action = contentType === 'reminder' ? 'openTrelloPopupReminder' : 'openTrelloPopupMessage';

	//make everything happen in the background process
	crossBrowser.runtime.sendMessage({
		action,
		permMsgId,
		userString,
		subject,
		viewType,
		contentType,
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
export async function buildTrelloPopupUrl(title?: string, attachment?: string) {
	const baseUrl = 'https://trello.com/add-card?';
	const baseParams = '&mode=popup&source=inbox.google.com';
	const titlePart = title ? '&name=' + encodeURIComponent(title) : '';
	const linkPart = attachment ? '&url=' + encodeURIComponent(attachment) : '';

	const { defaultBoard, defaultList } = await crossBrowser.storage.sync.get([
		'defaultBoard',
		'defaultList',
	]);

	const boardPart = defaultBoard ? '&idBoard=' + defaultBoard : '';
	const listPart = defaultList ? '&idList=' + defaultList : '';

	return baseUrl + baseParams + titlePart + linkPart + boardPart + listPart;
}
