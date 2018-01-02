chrome.runtime.onMessage.addListener(request => {
	// open new popup on message from content_scripts
	if (request.openPopup) {
		const url = request.openPopup;
		chrome.windows.create({ url, type: 'popup', width: 450, height: 450 });
	}
});
