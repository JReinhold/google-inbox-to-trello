// utility functions for Google Inbox specific features
import axios from 'axios';
import ChromePromise from 'chrome-promise';
import { getTextContent } from './dom';
import { getStringBetween } from './index';
const chromeP = new ChromePromise();

interface SearchUrlOptions {
	rfcId: string;
}
export function buildInboxSearchUrl({ rfcId }: SearchUrlOptions) {
	const baseUrl = 'https://inbox.google.com/u/0/search/';
	const searchOptions = encodeURIComponent('rfc822msgid:' + rfcId);
	return baseUrl + searchOptions;
}

export function parseInboxSyncResponse(responseData: InboxSyncResponseData) {
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

interface MessageData extends MessageDetails {
	action: string;
	globals: InboxGlobals;
}
export async function getMessageRfcIds({ globals, permMsgId }: MessageData) {
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
	return messageIdMaps;
}

export function getMessageDetails(toolbarTarget: EventTarget): MessageDetails {
	const toolbarElement = toolbarTarget as HTMLElement;

	let subject: string;
	let body: string;
	let permMsgId: string;
	let isListView: boolean;
	let listParent = toolbarElement.closest('div.an.b9');
	let messageParent = toolbarElement.closest('.aY.ac.X.s2');
	if (listParent) {
		// the button is pressed in the list view
		isListView = true;
		subject = getTextContent(listParent, '.bg > span');
		body = getTextContent(listParent, '.g6 > span');
		const msgAttribute = listParent.getAttribute('data-action-data') || '';
		permMsgId = 'thread-' + getStringBetween(msgAttribute, '#thread-', '"');
	} else if (messageParent) {
		// the button is pressed in the message view
		// TODO: selectors doesnt work here!!!!
		isListView = false;
		subject = getTextContent(messageParent, '.bg > span');
		body = getTextContent(messageParent, '.g6 > span');
		permMsgId = 'msg-a:r8799996822601559104';
	} else {
		throw new Error(
			'The Trello button was not clicked in a list or message view. Where was it clicked?',
		);
	}
	return { subject, body, permMsgId, isListView };
}
