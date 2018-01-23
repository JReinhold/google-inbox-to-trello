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
	createTrelloCard();
}
