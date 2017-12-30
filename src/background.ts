import { log, Person } from './util';

// Background can hold state to be shared over all content_scripts
let chosenOne: Person = { name: 'unknown' };

const fetchJson = (url: string) => fetch(url).then(response => response.json());

const getPerson = async (personId: number): Promise<Person> => {
	log(`Fetching person with id ${personId}`);
	return await fetchJson(`https://swapi.co/api/people/${personId}`);
};

const init = async () => {
	// Will fetch only once since we are in the background env
	const randomPersonId = Math.floor(Math.random() * 100);
	chosenOne = await getPerson(randomPersonId);

	// Registers to handle messages sent form content_script
	chrome.runtime.onMessage.addListener(
		(request, sender, sendResponse) =>
			request.question && sendResponse(`I think it is ${chosenOne.name}`),
	);
};

init();
