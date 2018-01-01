import { createToolbarButton } from './toolbar-button';

// initialize everything
(async function() {
	// initialize the SDK
	const sdk = await InboxSDK.load(2, 'sdk_mail-to-trello_a09aea7b41');
	sdk.Toolbars.registerThreadButton(createToolbarButton());

	const setting = chrome.storage.local.get('color', (item: any) => console.log('SETTINGS: ', item));
})();
