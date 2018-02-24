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

interface MessageSearchUrlOptions {
	rfcId: string;
	userString: string;
}
export function buildInboxMessageSearchUrl({ rfcId, userString }: MessageSearchUrlOptions) {
	const baseUrl = `https://inbox.google.com${userString}/search/`;
	const searchOptions = encodeURIComponent('rfc822msgid:' + rfcId);
	return baseUrl + searchOptions;
}
interface ReminderSearchUrlOptions {
	subject: string;
	userString: string;
}
export function buildInboxReminderSearchUrl({ subject, userString }: ReminderSearchUrlOptions) {
	const baseUrl = `https://inbox.google.com${userString}/search/`;
	const searchOptions = encodeURIComponent('in:reminder ' + subject);
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
	let contentType: MessageDetails['contentType'];
	let viewType: MessageDetails['viewType'];

	// determine what kind of element the button is inside
	// collapsed in the list, or expanded in full view? message or reminder?
	const collapsedParent = toolbarElement.closest('div.an');
	const expandedParent = toolbarElement.closest('div.ac.aY');

	if (collapsedParent) {
		viewType = 'collapsed';
		contentType = collapsedParent.classList.contains('b9') ? 'message' : 'reminder';

		subject = getTextContent(collapsedParent, '.bg > span');
		msgAttribute = collapsedParent.getAttribute('data-action-data') || '';
	} else if (expandedParent) {
		viewType = 'expanded';

		const attributeContainer = expandedParent.querySelector('div.bJ.s2');
		msgAttribute = attributeContainer
			? attributeContainer.getAttribute('data-action-data') || ''
			: '';

		if (expandedParent.classList.contains('s2')) {
			contentType = 'message';
			subject = getTextContent(expandedParent, '.eo > span');
		} else {
			contentType = 'reminder';
			subject = getTextContent(expandedParent, 'div.hF.pQ');
		}
	} else {
		throw new Error(
			'Could not determine where the button was clicked (collapsed vs. expanded). Where was it clicked?',
		);
	}

	const permMsgId = 'thread-' + getStringBetween(msgAttribute, '#thread-', '"');
	return { subject, permMsgId, contentType, viewType };
}
