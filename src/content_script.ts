import { createToolbarButton } from './toolbar-button';
import { attachElemToAll, buildTrelloButton, renderTrelloButton } from './utils';
require('arrive');

renderTrelloButton();

const mutationHandler: MutationCallback = mutations => {
	mutations.forEach(mutation => {
		const { addedNodes, removedNodes, target } = mutation;
		// a message is opened
		if (addedNodes.length > 0 && addedNodes[0].nodeName === 'DIV') {
			renderTrelloButton();
		}
		// a message is closed
		if (removedNodes.length > 0 && removedNodes[0].nodeName === 'DIV') {
			renderTrelloButton();
		}
		//navigation between menus
		if (target === headerElement) {
			renderTrelloButton();
		}
	});
};

(document.querySelector('.tE') as any).arrive(
	'ul.iK:not(.trelloAttached):not(.nL)',
	(newElem: any) => {
		console.log('created', newElem);
	},
);

const mutationOptions = {
	childList: true,
	subTree: true,
};
// observe when header element changes, to trigger on navigation between Done, Snoozed, etc.
const headerElement = document.body.querySelector('span.bl')!;

const observer = new MutationObserver(mutationHandler);
observer.observe(document.body, mutationOptions);
observer.observe(headerElement, mutationOptions);
