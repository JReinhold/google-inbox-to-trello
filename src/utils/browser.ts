import ChromePromise from 'chrome-promise';

export const crossBrowser: typeof chrome & typeof browser = (function() {
	// if we have window.browser, just return that, as that is default
	if (window.browser) {
		return window.browser;
	}

	//promisify chrome apis
	const chromePromisified = new ChromePromise();
	//except the apis that cant be promisified, we must replae them with the standard chrome apis
	//chrome.runtime.onMessage.addEventListener
	//chrome.runtime.sendMessage
	//chrome.runtime.getURL
	(chromePromisified.runtime as any) = {
		...chromePromisified.runtime,
		onMessage: {
			addListener: (callback: MessageCallback) => {
				window.chrome.runtime.onMessage.addListener(callback);
			},
		},
		sendMessage: window.chrome.runtime.sendMessage,
		getURL: window.chrome.runtime.getURL,
	};

	return chromePromisified;
})();

const syncStorage = {
	get: async (keys?: string | string[] | Object | null) => {
		if (window.chrome) {
			const chromeP = new ChromePromise();
			return chromeP.storage.sync.get(keys || null);
		} else if (window.browser) {
			return window.browser.storage.sync.get(keys || null);
		}
	},
};

type MessageCallback = (
	message: any,
	sender: chrome.runtime.MessageSender,
	sendResponse: (response: any) => void,
) => void;
