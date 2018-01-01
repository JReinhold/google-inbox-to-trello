function saveOptions(e: any) {
	e.preventDefault();
	chrome.storage.local.set({
		color: (document.querySelector('#color') as any).value,
	});
}

function restoreOptions() {
	function setCurrentChoice(result: any) {
		(document.querySelector('#color') as any).value = result.color || 'blue';
	}

	function onError(error: any) {
		console.log(`Error: ${error}`);
	}

	chrome.storage.local.get('color' as any, setCurrentChoice);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
(document.querySelector('form') as any).addEventListener('submit', saveOptions);
