import ChromePromise from 'chrome-promise';
import _ = require('lodash');

export const crossBrowser: typeof browser = (function() {
	// if we have browser, just return that, as that is default
	if (browser) {
		return browser;
	}

	//promisify chrome apis
	const chromePromisified = new ChromePromise();
	//except the apis that can't be promisified, we must replae them with the standard chrome apis
	//chrome.runtime.onMessage.addEventListener
	//chrome.runtime.sendMessage
	//chrome.runtime.getURL
	const apiOverrides = {
		runtime: {
			onMessage: {
				addListener: (callback: MessageCallback) => {
					window.chrome.runtime.onMessage.addListener(callback);
				},
			},
			sendMessage: window.chrome.runtime.sendMessage,
			getURL: window.chrome.runtime.getURL,
		},
	};
	//mutates chromePromisified object
	_.merge(chromePromisified, apiOverrides);

	return chromePromisified as any; //remove typing here, uses global browser type instead
})();

type MessageCallback = (
	message: any,
	sender: chrome.runtime.MessageSender,
	sendResponse: (response: any) => void,
) => void;
