import { getStringBetween } from './utils/index';
import { buildInboxSearchUrl, parseInboxSyncResponse, getMessageRfcIds } from './utils/inbox';
import { buildTrelloPopupUrl } from './utils/trello';

chrome.runtime.onMessage.addListener(async request => {
	// open new popup on message from content_scripts
	if (request.action === 'openTrelloPopup') {
		console.log('message to background', request);
		const messageIdMaps = await getMessageRfcIds(request);
		const searchUrl = buildInboxSearchUrl({ rfcId: messageIdMaps.threadIdMap.rfcId });
		const url = buildTrelloPopupUrl('cool title', undefined, searchUrl);
		chrome.windows.create({ url, type: 'popup', width: 500, height: 550 });
	}
});

// async function getMessageRfcId(permmsgid: string) {
// 	// build request url dynamically
// 	// - get permmsgid from content-script (DOM)
// 	// - get ik-value from content-script (DOM)
// 	// - get user number from content-script

// 	// read rfcid from extension storage
// 	// save rfcid to extension storage if not exists

// 	// This gets all cookies associated with the domain
// 	// We actually only need the cookies: OSID (inbox.google.com) and SID, HSID, SSID (.google.com)
// 	const cookies = await chromeP.cookies.getAll({ url: 'https://inbox.google.com' });
// 	const response = await axios.get('https://mail.google.com/mail/u/0', {
// 		params: {
// 			view: 'om',
// 			ik: 'ed32cda91c',
// 			permmsgid,
// 		},
// 		headers: {
// 			cookies,
// 		},
// 	});

// 	// make this failsafe. what if response != 200?
// 	// what if regex doesn't match any string?
// 	// extract the string that represents the RFC882ID
// 	const rfcId = getStringBetween(response.data, 'Message-ID: &lt;', '&gt;');
// 	console.log('rfcid: ', rfcId);
// 	return rfcId;
// }

// async function getRealPermMsgId(wrongPermMsgId: string) {
// 	// This gets all cookies associated with the domain
// 	// We actually only need the cookies: OSID (inbox.google.com) and SID, HSID, SSID (.google.com)
// 	const cookies = await chromeP.cookies.getAll({ url: 'https://inbox.google.com' });
// 	const response = await axios.get('https://mail.google.com/mail/u/0', {
// 		params: {
// 			view: 'cv',
// 			rt: 'c',
// 			search: 'inbox',
// 			ik: 'ed32cda91c',
// 			th: '1611320d1785ef50',
// 		},
// 		headers: {
// 			cookies,
// 		},
// 	});

// 	// make this failsafe. what if response != 200?
// 	// what if regex doesn't match any string?
// 	// extract the string that represents the RFC882ID
// 	const rfcId = getStringBetween(response.data, `"","\\\\u003c`, `\\\\u003e","`);
// 	console.log('rfcid from list view: ', rfcId);
// 	return rfcId;
// }
