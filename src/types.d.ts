import type { AtomClass } from "atom-class";
import type { DeepPartialWithNone } from "sync-utils";
import type { Atom } from "@rbxts/charm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AtomTable = Record<string, AtomClass<any>>;
export type Snapshot<T extends AtomTable> = { [K in keyof T]: T[K] extends AtomClass<infer R> ? R : never };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PatchSnapshot<T extends AtomTable> = {
	[K in keyof T]: DeepPartialWithNone<T[K] extends AtomClass<infer R> ? R : never>;
};

export type InitPayload<T extends AtomTable = AtomTable> = {
	type: "init";
	data: Snapshot<T>;
};

export type NewAtomsPayload<T extends AtomTable = AtomTable> = {
	type: "newAtoms";
	data: Snapshot<T>;
};

export type PatchPayload<T extends AtomTable = AtomTable> = {
	type: "patch";
	data: PatchSnapshot<T>;
};

export type Payload<T extends AtomTable = AtomTable> = InitPayload<T> | PatchPayload<T> | NewAtomsPayload<T>;

export interface ReadonlyAtom<T> {
	getData(): T;
	getAtom(): Atom<T>;
	subscribe(callback: (newState: T, previous: T) => void): () => void;
	subscribe<Y>(selector: (newState: T) => Y, callback: (newState: Y, previous: Y) => void): () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReadonlyAtomFrom<T extends AtomClass<any>> = ReadonlyAtom<T extends AtomClass<infer R> ? R : never>;
