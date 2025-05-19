import { subscribe } from "@rbxts/charm";
import { AtomClass } from "atom-class";

class AtomSlice<T extends (state: V) => Y, Y, V> extends AtomClass<Y> {
	private _unsubscribe: () => void;

	constructor(atom: AtomClass<V>, selector: T) {
		super(selector(atom.getData()));
		this._unsubscribe = atom.subscribe(selector, (state) => super.update(state));
	}

	public unslice() {
		this._unsubscribe();
	}

	public update(newState: unknown): Y {
		throw "Atom slice can't be updated";
	}
}

export function sliceAtom<T, Y>(atom: AtomClass<T>, selector: (state: T) => Y): AtomSlice<(state: T) => Y, Y, T> {
	return new AtomSlice(atom, selector);
}

export function bakeToAtom<T, Y>(target: AtomClass<T>, selector: () => Y, bake: (currentState: T, toBake: Y) => T) {
	const unsubscribe = subscribe(selector, (state) => target.update((currentState) => bake(currentState, state)));

	target.update((currentState) => bake(currentState, selector()));

	return unsubscribe;
}
