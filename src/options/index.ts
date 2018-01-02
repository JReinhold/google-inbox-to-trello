// save options to synchronized extension storage
function saveOptions(e: Event) {
	e.preventDefault();

	const defaultBoard = (<HTMLInputElement>document.querySelector('#defaultBoard')).value;
	const defaultList = (<HTMLInputElement>document.querySelector('#defaultList')).value;

	chrome.storage.sync.set({
		defaultBoard,
		defaultList,
	});
}

// inserts values from extension storage into the options view
function restoreOptionsToView() {
	function setCurrentOptions(result: any) {
		(<HTMLInputElement>document.querySelector('#defaultBoard')).value = result.defaultBoard || '';
		(<HTMLInputElement>document.querySelector('#defaultList')).value = result.defaultList || '';
	}

	chrome.storage.sync.get(setCurrentOptions);
}

document.addEventListener('DOMContentLoaded', restoreOptionsToView);
document.querySelector('form')!.addEventListener('submit', saveOptions);
