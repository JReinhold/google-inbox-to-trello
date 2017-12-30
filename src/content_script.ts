import { log } from './util';

/* 
 * Everytime the content_script is loaded (aka every new tab is loaded)
 * We ask the background it's guess about who is the chosen one in Star Wars
 */
chrome.runtime.sendMessage({ question: 'Who is the chosen one?' }, response => {
	log(response);
});
