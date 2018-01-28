// get the string between to other strings
export function getStringBetween(string: string, prefix: string, suffix: string) {
	const regexMatcher = new RegExp(`(?:${prefix})(.*?)(?:${suffix})`, 'g');
	console.log('regex', regexMatcher);
	const result = regexMatcher.exec(string);
	return result && result.length >= 2 ? result[1] : 'string not found';
}

export function buildTrelloButton(): HTMLElement {
	const rootLiElement = document.createElement('li');
	rootLiElement.title = 'Create Trello card';
	(rootLiElement as any).role = 'button';

	const imgElement = document.createElement('img');
	const regularSrcUrl = chrome.runtime.getURL('trello-btn-icon-black-24dp.png');
	const doubleSrcUrl = chrome.runtime.getURL('trello-btn-icon-black-24dp-2x.png');
	const quadrupleSrcUrl = chrome.runtime.getURL('trello-btn-icon-black-24dp-4x.png');
	imgElement.srcset = `${doubleSrcUrl} 2x, ${quadrupleSrcUrl} 4x`;
	imgElement.src = regularSrcUrl;
	rootLiElement.appendChild(imgElement);

	// add classes that match existing toolbar icons
	rootLiElement.classList.add('itemIconTrello', 'dU', 'action', 'actionIcon', 'AK', 'ew');
	return rootLiElement;
}
