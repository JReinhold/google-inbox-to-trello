import { createTrelloCard } from './trello-integration';

export const createToolbarButton = () => {
	return {
		title: 'Add to Trello',
		iconUrl: chrome.runtime.getURL('icon.png'),
		onClick: async (event: any) => {
			console.log('button pressed', event);
			let threadElement;
			if (event.position === 'ROW') {
				threadElement = event.selectedThreadRowViews[0];
			} else if (event.position === 'THREAD') {
				threadElement = event.selectedThreadViews[0];
			}
			// TODO: What about position = 'LIST'?

			const threadId = await threadElement.getThreadIDAsync();
			const msgSubject = threadElement.getSubject();
			createTrelloCard(msgSubject, undefined, 'https://mail.google.com/mail/#all/' + threadId);
		},
	};
};
