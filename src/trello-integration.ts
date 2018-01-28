import { getTextContent, getInboxGlobals } from './utils/dom';
import { getStringBetween } from './utils/index';

let defaultBoard: string | undefined;
let defaultList: string | undefined;

chrome.storage.sync.get(items => {
	defaultBoard = items.defaultBoard;
	defaultList = items.defaultList;
});

export function trelloClickHandler(event: Event) {
	const { permMsgId, subject, body, isListView } = getMessageDetails(event.target);

	//make everything happen in the background process
	chrome.runtime.sendMessage({
		action: 'openTrelloPopup',
		permMsgId,
		subject,
		body,
		isListView,
		globals: getInboxGlobals(),
	});
	// console.log('LOG: onclick', event);
	// const { subject, body } = getMessageDetails(event.target);
	// const searchUrl = buildInboxSearchUrl({ subject, body });
	// console.log('LOG: url', searchUrl);
	// chrome.runtime.sendMessage({ openPopup: searchUrl });

	// createTrelloCard(subject, body);
}

// triggers a pop up, that opens a specific URL to create a new Trello card.
// see https://developers.trello.com/v1.0/docs/clientjs#section-add-card
export function createTrelloCard(title?: string, description?: string, attachment?: string) {
	const urlBase = 'https://trello.com/add-card?';
	const titlePart = title ? '&name=' + encodeURIComponent(title) : '';
	const linkPart = attachment ? '&url=' + encodeURIComponent(attachment) : '';
	const boardPart = defaultBoard ? '&idBoard=' + defaultBoard : '';
	const listPart = defaultList ? '&idList=' + defaultList : '';

	const url = urlBase + titlePart + linkPart + boardPart + listPart;
	// send message to extension background process
	chrome.runtime.sendMessage({ openPopup: url });
}

function getMessageDetails(toolbarTarget: EventTarget): MessageDetails {
	const toolbarElement = toolbarTarget as HTMLElement;

	let subject: string;
	let body: string;
	let permMsgId: string;
	let isListView: boolean;
	let listParent = toolbarElement.closest('div.an.b9');
	let messageParent = toolbarElement.closest('.aY.ac.X.s2');
	if (listParent) {
		// the button is pressed in the list view
		isListView = true;
		subject = getTextContent(listParent, '.bg > span');
		body = getTextContent(listParent, '.g6 > span');
		const msgAttribute = listParent.getAttribute('data-action-data') || '';
		permMsgId = 'thread-' + getStringBetween(msgAttribute, '#thread-', '"');

		// permMsgId = 'msg-a:r8799996822601559104';
	} else if (messageParent) {
		// the button is pressed in the message view
		// TODO: selectors doesnt work here!!!!
		isListView = false;
		subject = getTextContent(messageParent, '.bg > span');
		body = getTextContent(messageParent, '.g6 > span');
		permMsgId = 'msg-a:r8799996822601559104';
	} else {
		throw new Error(
			'The Trello button was not clicked in a list or message view. Where was it clicked?',
		);
	}
	return { subject, body, permMsgId, isListView };
}

function buildInboxSearchUrl({ subject, body }: MessageDetails) {
	const baseUrl = 'https://inbox.google.com/u/0/search/';
	const searchPart = encodeURIComponent(`subject:"${subject}" "${body}"`);
	// add rfc822msgid
	return baseUrl + searchPart;
}
