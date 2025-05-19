/// <reference types="@rbxts/testez/globals" />

import { AtomClass } from "atom-class";
import { bakeToAtom, sliceAtom } from "utils";

export = function () {
	it("sliceAtom, get without update, gets selected root atom data", () => {
		const root = new AtomClass(0);
		const slice = sliceAtom(root, (state) => state + 1);

		expect(slice.getData()).to.equal(1);

		slice.unslice();
	});

	it("sliceAtom, update, gets updated selected atom data", () => {
		const root = new AtomClass(0);
		const slice = sliceAtom(root, (state) => state + 1);

		root.update((state) => state + 1);

		expect(slice.getData()).to.equal(2);

		slice.unslice();
	});

	it("sliceAtom, unslice and update, gets data before update", () => {
		const root = new AtomClass(0);
		const slice = sliceAtom(root, (state) => state + 1);

		slice.unslice();
		root.update((state) => state + 1);

		expect(slice.getData()).to.equal(1);
	});

	it("bakeToAtom, initial bake, puts first atom data to second one", () => {
		const vectorAtom = new AtomClass({ x: 0, y: 0 });
		const yAtom = new AtomClass(5);

		const unbake = bakeToAtom(
			vectorAtom,
			() => yAtom.getData(),
			(vector, y) => ({ ...vector, y }),
		);

		expect(vectorAtom.getData().y).to.equal(5);

		unbake();
	});

	it("bakeToAtom, update y atom, updates vector atom to match y atom", () => {
		const vectorAtom = new AtomClass({ x: 0, y: 0 });
		const yAtom = new AtomClass(5);

		const unbake = bakeToAtom(
			vectorAtom,
			() => yAtom.getData(),
			(vector, y) => ({ ...vector, y }),
		);

		yAtom.update((y) => y + 1);

		expect(vectorAtom.getData().y).to.equal(6);

		unbake();
	});
};
