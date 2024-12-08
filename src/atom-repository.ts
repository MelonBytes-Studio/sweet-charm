import { AtomClass } from "atom-class";
import { ServerSyncer } from "server-syncer";
import { AtomTable } from "types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AtomRepository<T extends AtomTable> {
	public readonly syncer: ServerSyncer;

	private store: T = {} as T;
	private parent?: AtomRepository<T>;

	constructor(parent?: AtomRepository<T>) {
		this.parent = parent;
		this.syncer = new ServerSyncer(parent?.syncer);
	}

	public get<Y extends keyof T>(name: Y): T[Y] {
		const atom = this.store[name] ?? this.parent?.get(name);
		assert(atom, `Can't get atom "${name as string}", this atom doesn't exists in repository.`);
		return atom;
	}

	public getAtoms(): Readonly<Partial<T>> {
		return { ...this.parent?.getAtoms(), ...this.store };
	}

	public define(atoms: Partial<T>) {
		const newStore = table.clone(this.store) as AtomTable;

		for (const [name, atom] of pairs(atoms)) {
			newStore[name as string] = atom as AtomClass<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
			this.syncer.add(name as string, atom as AtomClass<any>); // eslint-disable-line @typescript-eslint/no-explicit-any
		}

		this.store = newStore as T;
	}

	public subdivide() {
		return new AtomRepository(this);
	}
}
