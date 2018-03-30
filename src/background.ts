import { getStringBetween } from './utils/index';
import {
	buildInboxReminderSearchUrl,
	parseInboxSyncResponse,
	getMessageRfcIds,
	buildInboxMessageSearchUrl,
} from './utils/inbox';
import { buildTrelloPopupUrl } from './utils/trello';

/**
 * Listen for messages sent by the content script
 */
browser.runtime.onMessage.addListener(async (request: any) => {
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

/**
 * opens a Trello pop up when a message has been clicked
 */
async function openTrelloPopupMessage(messageData: MessageData) {
	const messageIdMaps = await getMessageRfcIds(messageData);
	const searchUrl = buildInboxMessageSearchUrl({
		rfcId: messageIdMaps.threadIdMap.rfcId,
		userString: messageData.userString,
	});
	const url = await buildTrelloPopupUrl(messageData.subject, searchUrl);
	browser.windows.create({ url, type: 'popup', width: 500, height: 400 });
}

/**
 * opens a Trello pop up when a reminder has been clicked
 */
async function openTrelloPopupReminder({ subject, userString }: MessageData) {
	const searchUrl = buildInboxReminderSearchUrl({
		subject,
		userString,
	});
	const url = await buildTrelloPopupUrl(subject, searchUrl);
	browser.windows.create({ url, type: 'popup', width: 500, height: 400 });
}
