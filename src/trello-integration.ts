let defaultBoard: string | undefined;
let defaultList: string | undefined;

chrome.storage.sync.get(items => {
	defaultBoard = items.defaultBoard;
	defaultList = items.defaultList;
});

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

export function trelloClickHandler(event: Event) {
	console.log('LOG: onclick', event);
	const { subject, body } = getMessageDetails(event.target);
	const searchUrl = buildInboxSearchUrl({ subject, body });
	console.log('LOG: url', searchUrl);
	chrome.runtime.sendMessage({ openPopup: searchUrl });

	// createTrelloCard(subject, body);
}

interface MessageDetails {
	subject?: string;
	body?: string;
}

function getMessageDetails(toolbarTarget: EventTarget): MessageDetails {
	const toolbarElement = toolbarTarget as HTMLElement;

	let parentElement: Element;
	let listParent = toolbarElement.closest('.l9');
	let messageParent = toolbarElement.closest('.aY.ac.X.s2');
	if (listParent) {
		// the button is pressed in the list view
		parentElement = listParent;
	} else if (messageParent) {
		// the button is pressed in the message view
		parentElement = messageParent;
	} else {
		throw new Error(
			'The Trello button was not clicked in a list or message view. Where was it clicked?',
		);
	}
	const subject = parentElement.querySelector('.bg > span')!.textContent!;
	const body = parentElement.querySelector('.g6 > span')!.textContent!;
	return { subject, body };
}

function buildInboxSearchUrl({ subject, body }: MessageDetails) {
	const baseUrl = 'https://inbox.google.com/u/0/search/';
	const searchPart = encodeURIComponent(`subject:"${subject}" "${body}"`);
	// add rfc822msgid
	return baseUrl + searchPart;
}
