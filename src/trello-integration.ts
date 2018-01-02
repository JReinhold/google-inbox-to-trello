import { trelloApiKey } from './secrets';

export function createTrelloCard(title?: string, description?: string, attachment?: string) {
	const urlBase = 'https://trello.com/add-card?';
	const titlePart = title ? '&name=' + title : '';
	const linkPart = attachment ? '&url=' + encodeURIComponent(attachment) : '';
	const url = `${urlBase}${titlePart}${linkPart}&idBoard=SOMEID&idList=SOMEID`;
	chrome.runtime.sendMessage({ openPopup: url });
}
