import ChromePromise from 'chrome-promise';
import axios from 'axios';
import { getStringBetween } from './utils/index';
const chromeP = new ChromePromise();

chrome.runtime.onMessage.addListener(async request => {
	// open new popup on message from content_scripts
	if (request.openPopup) {
		const url = request.openPopup;
		chrome.windows.create({ url, type: 'popup', width: 500, height: 550 });
		return;
	} else if (request.action === 'openTrelloPopup') {
		console.log('message to background', request);
		const rfcId = await getMessageRfcIds(request);
		// if (request.isListView) {
		// const realPermMsgId = await getRealPermMsgId(request.permMsgId);
		// rfcId = await getMessageRfcId(realPermMsgId);
		// } else {
		// rfcId = await getMessageRfcId(request.permMsgId);
		// }
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

interface MessageData extends MessageDetails {
	action: string;
	globals: InboxGlobals;
}
async function getMessageRfcIds({ globals, permMsgId }: MessageData) {
	// This gets all cookies associated with the domain
	// We actually only need the cookies: OSID (inbox.google.com) and SID, HSID, SSID (.google.com)
	const cookies = await chromeP.cookies.getAll({ url: 'https://inbox.google.com' });
	const xGmailBtaiHeader = JSON.stringify({
		'5': globals.ik,
		'7': 7,
		'8': globals.bigtop,
		'9': 5,
		'10': 5,
		'11': '',
		'16': globals.unknownGmailNumber,
	});
	const postBody = {
		'1': [{ '1': permMsgId, '3': [] }],
	};
	const response = await axios.post('https://inbox.google.com/sync/u/0/i/fd', postBody, {
		headers: {
			cookies,
			'x-gmail-btai': xGmailBtaiHeader,
			'x-framework-xsrf-token': globals.xsrfToken,
		},
	});
	const messageIdMaps = parseInboxSyncResponse(response.data);
	console.log('SEARCH STRING:');
	console.log(`https://inbox.google.com/u/0/search/rfc822msgid:${messageIdMaps.threadIdMap.rfcId}`);
}

function parseInboxSyncResponse(responseData: InboxSyncResponseData) {
	const messagesArray = responseData[2][0][3];
	const messageIdMap: MessageIdMap[] = messagesArray.map((message: InboxSyncResponseMessage) => {
		const rfcString = message[2][8];
		// remove the leading and trailing < >
		const rfcId = rfcString.substring(1, rfcString.length - 1);
		return {
			permMsgId: message[1],
			rfcId,
		};
	});
	const threadIdMap = messageIdMap[0];
	return {
		threadIdMap,
		messageIdMap,
	};
}

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
