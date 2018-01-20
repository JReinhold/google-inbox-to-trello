interface AttachOptions {
	prepend?: boolean;
}

export function attachElemToAll(
	elementToAdd: HTMLElement,
	selector: string,
	opts: AttachOptions = {},
) {
	const selectedElements = document.querySelectorAll(selector);
	for (let i = 0; i < selectedElements.length; i++) {
		const parent = selectedElements[i];
		opts.prepend
			? parent.insertBefore(elementToAdd.cloneNode(true), parent.firstChild)
			: parent.appendChild(elementToAdd.cloneNode(true));
	}
	return selectedElements;
}

export function buildTrelloButton(): HTMLElement {
	const rootElem = document.createElement('li');
	rootElem.appendChild(document.createTextNode('Trello'));
	// add classes that match existing toolbar icons
	rootElem.classList.add('du', 'action', 'actionIcon', 'ew');
	return rootElem;
}
