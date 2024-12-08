/* eslint-disable @typescript-eslint/no-explicit-any */
import { batch } from "@rbxts/charm";
import { AtomClass } from "atom-class";
import { applyPatch } from "sync-utils";
import { AtomTable, Payload, Snapshot } from "types";

export class ClientSyncer {
	private isHydrated = false;

	constructor(private atoms: Map<string, AtomClass<any>>) {}

	public sync(payload: Payload) {
		if (!this.isHydrated && payload.type !== "init") return;

		if (!this.isHydrated && payload.type === "init") {
			this.isHydrated = true;
			this.createAtomsFromSnapshot(payload.data);
			return;
		}

		if (payload.type === "newAtoms") {
			this.createAtomsFromSnapshot(payload.data);
			return;
		}

		if (payload.type === "patch") {
			batch(() => {
				for (const [id, patch] of pairs(payload.data)) {
					if (!this.atoms.has(id as string)) {
						warn(`Can't apply patch for atom "${id}", this atom doesn't exists in repository.`);
						continue;
					}

					const atom = this.atoms.get(id as string)!;
					atom.update(applyPatch(atom.getData(), patch));
				}
			});

			return;
		}
	}

	private createAtomsFromSnapshot(snapshot: Snapshot<AtomTable>) {
		for (const [id, atomData] of pairs(snapshot)) {
			this.atoms.set(id as string, new AtomClass(atomData));
		}
	}
}
