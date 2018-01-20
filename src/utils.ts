interface AttachOptions {
	prepend?: boolean;
	once?: string;
}

// attach an element to all of the elements matching selectors
// either append or prepend
// optionally supply a 'once' string, that adds a class to all matching elements,
// that makes sure it only gets attached once to that element.
export function attachElemToAll(
	elementToAdd: HTMLElement,
	selector: string,
	opts: AttachOptions = {},
) {
	if (opts.once) {
		selector += `:not(.${opts.once})`;
	}

	const selectedElements = document.querySelectorAll(selector);
	for (let i = 0; i < selectedElements.length; i++) {
		const parent = selectedElements[i];
		if (opts.once) {
			parent.classList.add(opts.once);
		}

		opts.prepend
			? parent.insertBefore(elementToAdd.cloneNode(true), parent.firstChild)
			: parent.appendChild(elementToAdd.cloneNode(true));
	}
	return selectedElements;
}

export function buildTrelloButton(): HTMLElement {
	const rootLiElement = document.createElement('li');
	const imgElement = document.createElement('img');

	const regularSrcUrl = chrome.runtime.getURL('trello-btn-icon-black-24dp.png');
	const doubleSrcUrl = chrome.runtime.getURL('trello-btn-icon-black-24dp-2x.png');
	const quadrupleSrcUrl = chrome.runtime.getURL('trello-btn-icon-black-24dp-4x.png');
	imgElement.srcset = `${doubleSrcUrl} 2x, ${quadrupleSrcUrl} 4x`;
	imgElement.src = regularSrcUrl;

	rootLiElement.appendChild(imgElement);
	// add classes that match existing toolbar icons
	rootLiElement.classList.add('du', 'action', 'actionIcon', 'ew');
	return rootLiElement;
}
