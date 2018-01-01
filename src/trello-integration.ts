import { trelloApiKey } from './secrets';

export function createTrelloCard(title?: string, description?: string, attachment?: string) {
	console.log('title', title);
	console.log('attachment', attachment);
	console.log('api key', trelloApiKey);
}
