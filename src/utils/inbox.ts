// utility functions for Google Inbox specific features
import axios from 'axios';
import ChromePromise from 'chrome-promise';
import { getTextContent } from './dom';
import { getStringBetween } from './index';
const chromeP = new ChromePromise();

export function getUserString() {
	// if multiple accounts logged in, get current user number from URL, it is just after the /u/ part
	const userNumber = location.href.split('/u/', 2)[1];
	const userString = userNumber ? '/u/' + userNumber.charAt(0) : '';
	return userString;
}

interface SearchUrlOptions {
	rfcId: string;
	userString: string;
}
export function buildInboxSearchUrl({ rfcId, userString }: SearchUrlOptions) {
	const baseUrl = `https://inbox.google.com${userString}/search/`;
	const searchOptions = encodeURIComponent('rfc822msgid:' + rfcId);
	return baseUrl + searchOptions;
}

// parse the resonse from inbox sync from random arrays into
// maps between permanent message ids to rfc822 message ids
// ie. map ids we can read from the DOM to ids we can search for
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

// get rfc822 message ids for all messages in a thread
// makes a request to inbox.google.com that mimics how Inbox usually syncs data
// returns a map between permanent message ids and rfc822 ids
export async function getMessageRfcIds({ globals, permMsgId, userString }: MessageData) {
	// I don't know what all this data is, I just know it is needed for the request to be valid
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

	const response = await axios.post(`https://inbox.google.com/sync${userString}/i/fd`, postBody, {
		headers: {
			'x-gmail-btai': xGmailBtaiHeader,
			'x-framework-xsrf-token': globals.xsrfToken,
		},
	});

	const messageIdMaps = parseInboxSyncResponse(response.data);
	return messageIdMaps;
}

/**
 * traverses the DOM surrounding an action button (such as the Trello button), to extract information
 * @param toolbarTarget the action button that was clicked, needs to be inside the action list
 * @returns MessageDetails: { subject, permMsgId, isListView}
 */
export function getMessageDetails(toolbarTarget: EventTarget): MessageDetails {
	const toolbarElement = toolbarTarget as HTMLElement;

	let subject: string;
	let body: string;
	let msgAttribute: string;
	let isListView: boolean;
	let listParent = toolbarElement.closest('div.an.b9');
	let messageParent = toolbarElement.closest('div.bJ.s2');
	if (listParent) {
		// the button is pressed in the list view
		isListView = true;
		subject = getTextContent(listParent, '.bg > span');
		msgAttribute = listParent.getAttribute('data-action-data') || '';
	} else if (messageParent) {
		// the button is pressed in the message view
		isListView = false;
		subject = getTextContent(messageParent, '.eo > span');
		msgAttribute = messageParent.getAttribute('data-action-data') || '';
	} else {
		throw new Error(
			'The Trello button was not clicked in a list or message view. Where was it clicked?',
		);
	}
	const permMsgId = 'thread-' + getStringBetween(msgAttribute, '#thread-', '"');
	return { subject, permMsgId, isListView };
}
