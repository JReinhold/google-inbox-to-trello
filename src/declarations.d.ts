declare var InboxSDK: any;
declare module 'arrive';
declare function require(name: string): Function;

interface WithArrive extends Element {
	arrive: (selector: string, callback: (newElement: HTMLElement) => void) => void;
}
