import * as _ from 'lodash';

/**
 *
 * @param elem element to get text from. if childSelector specified, get text from further down the tree
 * @param childSelector optional. a selector for the child of elem to get text from
 * @return text content as string, if no text found, return empty string
 */
export function getTextContent(elem: Element, childSelector?: string): string {
	const childElem = childSelector ? elem.querySelector(childSelector) : elem;
	const text = childElem ? childElem.textContent : '';
	return text || '';
}

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
	Array.from(selectedElements).forEach(elem => {
		if (opts.once) {
			elem.classList.add(opts.once);
		}

		opts.prepend
			? elem.insertBefore(elementToAdd.cloneNode(true), elem.firstChild)
			: elem.appendChild(elementToAdd.cloneNode(true));
	});

	return selectedElements;
}

let inboxGlobals: InboxGlobals;
// gets global variables from Inbox scripts
// uses all sorts of weird scripts that tslint doesn't allow
/*tslint:disable*/
export const getInboxGlobals = () => {
	if (inboxGlobals) {
		return inboxGlobals;
	}
	const scriptsElements = document.querySelectorAll('head > script');
	const globalsScript = _.find(scriptsElements, script =>
		script.innerHTML.startsWith('(function(){window.BT_EmbeddedAppData'),
	);
	if (globalsScript) {
		// create a dummy BT_Now function to make sure eval() doesn't fail
		(window as any).BT_Now = () => {};
		eval(globalsScript.innerHTML);
	}

	const BT_EmbeddedAppData = (window as any).BT_EmbeddedAppData;
	const globals = {
		unknownGmailNumber: BT_EmbeddedAppData[1],
		bigtop: BT_EmbeddedAppData[2],
		ik: BT_EmbeddedAppData[11],
		xsrfToken: BT_EmbeddedAppData[12],
	};
	inboxGlobals = globals;
	return inboxGlobals;
};
/*tslint:enable*/
