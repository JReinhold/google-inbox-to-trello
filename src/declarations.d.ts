declare module 'arrive';
declare function require(name: string): Function;

interface Window {
	BT_EmbeddedAppData: any;
	BT_Now: () => void;
}

interface WithArrive extends Element {
	arrive: (selector: string, callback: (newElement: HTMLElement) => void) => void;
}

interface ExtensionStorage {
	defaultBoard: string;
	defaultList: string;
}

interface MessageDetails {
	subject: string;
	permMsgId: string;
	contentType: 'message' | 'reminder';
	viewType: 'collapsed' | 'expanded';
}

interface MessageData extends MessageDetails {
	action: string;
	globals: InboxGlobals;
	userString: string;
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
	1: string; //permanent message id
	2: {
		8: string; //rfc822 message id
	};
}

//a map between a permanent message id, and the rfc822 id of the message
interface MessageIdMap {
	permMsgId: string;
	rfcId: string;
}
