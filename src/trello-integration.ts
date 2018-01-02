import { trelloApiKey } from './secrets';

let defaultBoard: string | undefined;
let defaultList: string | undefined;

chrome.storage.sync.get(items => {
	defaultBoard = items.defaultBoard;
	defaultList = items.defaultList;
});

export function createTrelloCard(title?: string, description?: string, attachment?: string) {
	const urlBase = 'https://trello.com/add-card?';
	const titlePart = title ? '&name=' + title : '';
	const linkPart = attachment ? '&url=' + encodeURIComponent(attachment) : '';
	const boardPart = defaultBoard ? '&idBoard=' + defaultBoard : '';
	const listPart = defaultList ? '&idList=' + defaultList : '';

	const url = urlBase + titlePart + linkPart + boardPart + listPart;
	chrome.runtime.sendMessage({ openPopup: url });
}
