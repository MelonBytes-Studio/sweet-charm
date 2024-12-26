/// <reference types="@rbxts/testez/globals" />

import { AtomClass } from "atom-class";
import { ClientSyncer } from "client-syncer";

export = function () {
	it("hydrate", () => {
		const atoms = new Map<string, AtomClass<number>>();
		const syncer = new ClientSyncer(atoms);

		syncer.sync({
			type: "init",
			data: {
				money: 100,
			},
		});

		expect(atoms.get("money")).to.be.ok();
		expect(atoms.get("money")!.getData()).to.equal(100);
	});

	it("shall skip other payloads before hydrate", () => {
		const atoms = new Map<string, AtomClass<number>>();
		const syncer = new ClientSyncer(atoms);

		atoms.set("money", new AtomClass(100));

		syncer.sync({
			type: "patch",
			data: {
				money: 200,
			},
		});

		expect(atoms.get("money")!.getData()).to.equal(100);
	});

	it("patch", () => {
		const atoms = new Map<string, AtomClass<number>>();
		const syncer = new ClientSyncer(atoms);

		syncer.sync({
			type: "init",
			data: {
				money: 100,
			},
		});

		syncer.sync({
			type: "patch",
			data: {
				money: 200,
			},
		});

		expect(atoms.get("money")!.getData()).to.equal(200);
	});

	it("new atoms", () => {
		const atoms = new Map<string, AtomClass<number>>();
		const syncer = new ClientSyncer(atoms);

		syncer.sync({
			type: "init",
			data: {
				money: 100,
			},
		});

		syncer.sync({
			type: "newAtoms",
			data: {
				age: 20,
			},
		});

		expect(atoms.get("age")).to.be.ok();
		expect(atoms.get("age")!.getData()).to.equal(20);
	});

	it("remove atom", () => {
		const atoms = new Map<string, AtomClass<number>>();
		const syncer = new ClientSyncer(atoms);

		syncer.sync({
			type: "init",
			data: {
				money: 100,
			},
		});

		expect(atoms.get("money")).to.be.ok();

		syncer.sync({
			type: "removeAtoms",
			data: ["money"],
		});

		expect(atoms.get("money")).never.to.be.ok();
	});
};
