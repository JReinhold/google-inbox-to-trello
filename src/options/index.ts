import { crossBrowser } from './../utils/browser';

// save options to synchronized extension storage
function saveOptions(e: Event) {
	e.preventDefault();

	const defaultBoard = (<HTMLInputElement>document.querySelector('#defaultBoard')).value;
	const defaultList = (<HTMLInputElement>document.querySelector('#defaultList')).value;

	browser.storage.sync.set({
		defaultBoard,
		defaultList,
	});
}

// inserts values from extension storage into the options view
async function restoreOptionsToView() {
	function setCurrentOptions(result: { [key: string]: any }) {
		(<HTMLInputElement>document.querySelector('#defaultBoard')).value = result.defaultBoard || '';
		(<HTMLInputElement>document.querySelector('#defaultList')).value = result.defaultList || '';
	}

	const options = await browser.storage.sync.get();
	setCurrentOptions(options);
}

document.addEventListener('DOMContentLoaded', restoreOptionsToView);
document.querySelector('form')!.addEventListener('submit', saveOptions);
