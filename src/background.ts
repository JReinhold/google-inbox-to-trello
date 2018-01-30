import { getStringBetween } from './utils/index';
import { buildInboxSearchUrl, parseInboxSyncResponse, getMessageRfcIds } from './utils/inbox';
import { buildTrelloPopupUrl } from './utils/trello';
import { crossBrowser } from './utils/browser';

crossBrowser.runtime.onMessage.addListener(async request => {
	// open new popup on message from content_scripts
	if (request.action === 'openTrelloPopup') {
		const messageData: MessageData = request;
		const messageIdMaps = await getMessageRfcIds(messageData);
		const searchUrl = buildInboxSearchUrl({
			rfcId: messageIdMaps.threadIdMap.rfcId,
			userString: messageData.userString,
		});
		const url = await buildTrelloPopupUrl(messageData.subject, searchUrl);
		crossBrowser.windows.create({ url, type: 'popup', width: 500, height: 400 });
	}
});
