function saveOptions(e: any) {
	e.preventDefault();
	chrome.storage.local.set({
		defaultBoard: (document.querySelector('#boardId') as any).value,
		defaultList: (document.querySelector('#listId') as any).value,
	});
}

function restoreOptionsToView() {
	function setCurrentChoice(result: any) {
		(document.querySelector('#boardId') as any).value = result.defaultBoard || '';
		(document.querySelector('#listId') as any).value = result.defaultList || '';
	}

	function onError(error: any) {
		console.log(`Error: ${error}`);
	}

	chrome.storage.local.get(setCurrentChoice);
}

document.addEventListener('DOMContentLoaded', restoreOptionsToView);
(document.querySelector('form') as any).addEventListener('submit', saveOptions);
