import { getStringBetween } from './utils/index';
import {
	buildInboxReminderSearchUrl,
	parseInboxSyncResponse,
	getMessageRfcIds,
	buildInboxMessageSearchUrl,
} from './utils/inbox';
import { buildTrelloPopupUrl } from './utils/trello';
import { crossBrowser } from './utils/browser';

crossBrowser.runtime.onMessage.addListener(async request => {
	switch (request.action) {
		case 'openTrelloPopupMessage':
			openTrelloPopupMessage(request);
			break;
		case 'openTrelloPopupReminder':
			openTrelloPopupReminder(request);
			break;
		default:
			break;
	}
});

async function openTrelloPopupMessage(messageData: MessageData) {
	const messageIdMaps = await getMessageRfcIds(messageData);
	const searchUrl = buildInboxMessageSearchUrl({
		rfcId: messageIdMaps.threadIdMap.rfcId,
		userString: messageData.userString,
	});
	const url = await buildTrelloPopupUrl(messageData.subject, searchUrl);
	crossBrowser.windows.create({ url, type: 'popup', width: 500, height: 400 });
}

async function openTrelloPopupReminder({ subject, userString }: MessageData) {
	const searchUrl = buildInboxReminderSearchUrl({
		subject,
		userString,
	});
	const url = await buildTrelloPopupUrl(subject, searchUrl);
	crossBrowser.windows.create({ url, type: 'popup', width: 500, height: 400 });
}
