import { createTrelloCard } from './trello-integration';

// create a button on the toolbar, with a New Trello Card action
export const createToolbarButton = () => {
	return {
		title: 'Add to Trello',
		iconUrl: chrome.runtime.getURL('trello-mark-blue.svg'),
		onClick: async (event: any) => {
			let threadElement, messageView;
			if (event.position === 'THREAD') {
				threadElement = event.selectedThreadViews[0];
			} else {
				threadElement = event.selectedThreadRowViews[0];
			}

			const threadId = await threadElement.getThreadIDAsync();
			const msgSubject = threadElement.getSubject();
			createTrelloCard(msgSubject, undefined, 'https://mail.google.com/mail/#all/' + threadId);
		},
	};
};
