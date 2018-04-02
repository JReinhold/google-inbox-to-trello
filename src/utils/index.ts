/**
 * Finds a substring within another string, using a prefix and a suffix as a search
 * @param string the full string to extract from
 * @param prefix The substring that is BEFORE the substring to find
 * @param suffix The substring that is AFTER the substring to find
 * @returns the string, or 'string not found' if it wasn't found
 */
export function getStringBetween(string: string, prefix: string, suffix: string) {
	const regexMatcher = new RegExp(`(?:${prefix})(.*?)(?:${suffix})`, 'g');
	const result = regexMatcher.exec(string);
	return result && result.length >= 2 ? result[1] : 'string not found';
}

/**
 * Creates the Trello button for the action list, matching the style of the regular action buttons
 * returns an HTMLElement ready to be attach to the DOM.
 */
export function buildTrelloButton(): HTMLElement {
	const rootLiElement = document.createElement('li');
	rootLiElement.title = 'Create Trello card';
	(rootLiElement as any).role = 'button';

	const imgElement = document.createElement('img');
	const regularSrcUrl = browser.runtime.getURL('assets/trello-btn-icon-black-24dp.png');
	const doubleSrcUrl = browser.runtime.getURL('assets/trello-btn-icon-black-24dp-2x.png');
	const quadrupleSrcUrl = browser.runtime.getURL('assets/trello-btn-icon-black-24dp-4x.png');
	imgElement.srcset = `${doubleSrcUrl} 2x, ${quadrupleSrcUrl} 4x`;
	imgElement.src = regularSrcUrl;
	rootLiElement.appendChild(imgElement);

	// add classes that match existing toolbar icons
	rootLiElement.classList.add('itemIconTrello', 'dU', 'action', 'actionIcon', 'AK', 'ew');
	return rootLiElement;
}
