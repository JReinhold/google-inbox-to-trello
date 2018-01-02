chrome.runtime.onMessage.addListener(request => {
	if (request.openPopup) {
		const url = request.openPopup;
		chrome.windows.create({ url, type: 'popup', width: 450, height: 450 });
	}
});
