/* eslint-disable @typescript-eslint/no-explicit-any */
import { Players } from "@rbxts/services";
import { setInterval } from "@rbxts/set-timeout";
import { AtomClass } from "atom-class";
import { createPatch, isEmptyTable } from "sync-utils";
import type { AtomTable, InitPayload, NewAtomsPayload, PatchPayload, Payload, Snapshot } from "types";

export class ServerSyncer {
	public isStarted = false;

	private atoms = new Map<string, AtomClass<any>>();

	private subscriptions: (() => void)[] = [];
	private watchers: ((player: Player, payload: Payload) => void)[] = [];

	private currentSnapshot!: Snapshot<AtomTable>;
	private newSnapshot?: Snapshot<AtomTable>;

	private parent?: ServerSyncer;

	constructor(parentSyncer?: ServerSyncer) {
		if (!parentSyncer) return;

		this.parent = parentSyncer;
		this.parent.watchDispatch((player, payload) => {
			if (payload.type === "init") return;

			if (payload.type === "newAtoms") {
				return this.sync(player, payload);
			}

			const patchPayload = {} as PatchPayload;

			patchPayload.type = "patch";
			patchPayload.data = {};

			for (const [id, patch] of pairs(payload.data)) {
				if (this.atoms.has(id)) continue;
				patchPayload.data[id] = patch;
			}

			if (isEmptyTable(patchPayload.data)) return;

			this.sync(player, patchPayload);
		});
	}

	public add(id: string, atom: AtomClass<any>) {
		this.atoms.set(id, atom);
		this.subscriptions.push(
			atom.subscribe((newState) => {
				this.markAsUpdated(id, newState);
			}),
		);

		if (this.isStarted) this.syncNewAtom(id, atom);
	}

	public start(interval?: number) {
		assert(this.isStarted === false, "Server syncer already started.");

		this.isStarted = true;
		this.currentSnapshot = this.createSnapshot();

		const disconnect = setInterval(() => {
			if (this.newSnapshot === undefined) return;

			const patchPayload = {} as PatchPayload;

			patchPayload.type = "patch";
			patchPayload.data = createPatch(this.currentSnapshot, this.newSnapshot);

			for (const player of Players.GetPlayers()) {
				this.sync(player, patchPayload);
			}

			this.currentSnapshot = this.newSnapshot;
			this.newSnapshot = undefined;
		}, interval ?? 0);

		return () => {
			disconnect();
			this.isStarted = false;
		};
	}

	public hydrate(player: Player) {
		const payload = {} as InitPayload;

		payload.type = "init";
		payload.data = { ...this.parent?.createSnapshot(), ...this.createSnapshot() };

		this.sync(player, payload);
	}

	public watchDispatch(watcher: (player: Player, payload: Payload) => void) {
		this.watchers.insert(0, watcher);
		return () => this.watchers.remove(this.watchers.findIndex((w) => w === watcher));
	}

	private sync(player: Player, payload: Payload) {
		for (const watcher of this.watchers) {
			task.spawn(watcher, player, payload);
		}
	}

	private syncNewAtom(id: string, atom: AtomClass<any>) {
		const payload = {} as NewAtomsPayload;

		payload.type = "newAtoms";
		payload.data = {
			[id]: atom.getData(),
		};

		for (const player of Players.GetPlayers()) {
			this.sync(player, payload);
		}
	}

	private markAsUpdated(id: string, newState: any) {
		if (!this.newSnapshot) {
			this.newSnapshot = table.clone(this.currentSnapshot) as Snapshot<AtomTable>;
		}

		this.newSnapshot[id] = newState;
	}

	private createSnapshot() {
		const snapshot: Snapshot<AtomTable> = {};

		for (const [id, atom] of this.atoms) {
			const data = atom.getData();
			snapshot[id as string] = typeOf(data) === "table" ? table.clone(data) : data;
		}

		return snapshot;
	}
}
