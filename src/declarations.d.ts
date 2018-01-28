declare var InboxSDK: any;
declare module 'arrive';
declare function require(name: string): Function;

interface WithArrive extends Element {
	arrive: (selector: string, callback: (newElement: HTMLElement) => void) => void;
}

interface MessageDetails {
	subject: string;
	body: string;
	permMsgId: string;
	isListView: boolean;
}

interface InboxGlobals {
	unknownGmailNumber: number;
	bigtop: string;
	ik: string;
	xsrfToken: string;
}

// typings for the response when requesting inbox.google.com for message details
// they are incomplete, only includes the fields that are actually used
interface InboxSyncResponseData {
	2: [
		{
			3: InboxSyncResponseMessage[];
		}
	];
}
interface InboxSyncResponseMessage {
	1: string;
	2: {
		8: string;
	};
}

//a map between a permanent message id, and the rfc822 id of the message
interface MessageIdMap {
	permMsgId: string;
	rfcId: string;
}
