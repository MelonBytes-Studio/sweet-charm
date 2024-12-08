import { atom, Atom, subscribe } from "@rbxts/charm";

export class AtomClass<T> {
	private atom: Atom<T>;

	constructor(defaultValue: T) {
		this.atom = atom(defaultValue);
	}

	public getAtom() {
		return this.atom;
	}

	public getData() {
		return this.atom();
	}

	public update(updater: (previous: T) => T): T;
	public update(newState: T): T;
	public update(value: unknown) {
		if (typeOf(value) === "function") {
			return this.atom(value as (previous: T) => T);
		}

		return this.atom(value as T);
	}

	public subscribe(callback: (newState: T, previous: T) => void): () => void;
	public subscribe<Y>(selector: (newState: T) => Y, callback: (newState: Y, previous: Y) => void): () => void;
	public subscribe(...args: unknown[]) {
		if (args.size() === 1) {
			return subscribe(this.atom, args[0] as (newState: T) => void);
		}

		const selector = args[0] as <Y>(newState: T) => Y;
		const callback = args[1] as <Y>(newState: Y, previous: Y) => void;

		return subscribe(() => selector(this.atom()), callback);
	}
}
