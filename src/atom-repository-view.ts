import { AtomClass } from "atom-class";
import { ClientSyncer } from "client-syncer";
import { AtomTable, ReadonlyAtomFrom } from "types";

export class AtomRepositoryView<T extends AtomTable> {
	public readonly syncer;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private store = new Map<string, AtomClass<any>>();

	constructor() {
		this.syncer = new ClientSyncer(this.store);
	}

	public get<Y extends keyof T>(name: Y): ReadonlyAtomFrom<T[Y]> {
		const atom = this.store.get(name as string);
		assert(atom, `Can't get atom "${name as string}", this atom doesn't exists in repository.`);
		return atom as T[Y];
	}

	public tryGetAtom<Y extends keyof T>(name: Y): ReadonlyAtomFrom<T[Y]> | undefined {
		return this.store.get(name as string);
	}
}
