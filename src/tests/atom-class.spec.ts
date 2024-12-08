/// <reference types="@rbxts/testez/globals" />

import { AtomClass } from "atom-class";

export = function () {
	it("getData", () => {
		const atom = new AtomClass(0);
		expect(atom.getData()).to.equal(0);
	});

	it("getAtom", () => {
		const atom = new AtomClass(0);
		expect(typeOf(atom.getAtom())).to.equal("function");
		expect(atom.getAtom()()).to.equal(0);
	});

	it("update (value)", () => {
		const atom = new AtomClass(0);
		expect(atom.update(1)).to.equal(1);
		expect(atom.getData()).to.equal(1);
	});

	it("update (function)", () => {
		const atom = new AtomClass(0);
		expect(
			atom.update((previous) => {
				expect(previous).to.equal(0);
				return previous + 1;
			}),
		).to.equal(1);

		expect(atom.getData()).to.equal(1);
	});

	it("subscribe", () => {
		const atom = new AtomClass(0);
		let subscribeResult: number | undefined = undefined;

		const unsubscribe = atom.subscribe((result) => {
			subscribeResult = result;
		});

		atom.update(1);
		expect(subscribeResult).to.equal(1);

		unsubscribe();
	});
};
