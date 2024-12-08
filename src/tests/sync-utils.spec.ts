/// <reference types="@rbxts/testez/globals" />

import { applyPatch, createPatch, isEmptyTable, isNone, isSparseArray, serializeSparseArray } from "sync-utils";

export = function () {
	it("isNone", () => {
		expect(isNone(0)).to.equal(false);
		expect(isNone({ __none: "__none" })).to.equal(true);
	});

	it("isEmptyTable", () => {
		expect(isEmptyTable(0)).to.equal(false);
		expect(isEmptyTable([1, 2, 3])).to.equal(false);

		expect(isEmptyTable([])).to.equal(true);
	});

	it("isSparseArray", () => {
		expect(isSparseArray([])).to.equal(false);
		expect(isSparseArray([1, 2, 3, 4])).to.equal(false);
		expect(isSparseArray(0)).to.equal(false);

		const sparseArray: Record<number, number> = {};

		sparseArray[1] = 1;
		sparseArray[3] = 2;

		expect(isSparseArray(sparseArray)).to.equal(true);
	});

	it("serializeSparseArray", () => {
		expect(serializeSparseArray(1)).to.equal(1);

		const sparseArray: Record<number, number> = {};

		sparseArray[1] = 1;
		sparseArray[3] = 2;

		const serializedSparseArray = serializeSparseArray(sparseArray);

		expect(serializedSparseArray["1"]).to.equal(1);
		expect(serializedSparseArray["3"]).to.equal(2);
	});

	describe("createPatch", () => {
		it("simple types", () => {
			const previous = { a: 1 };
			const current = { a: 2 };

			const patch = createPatch(previous, current);

			expect(patch.a).to.equal(2);
		});

		it("no changes", () => {
			const current = { a: 1 };
			const patch = createPatch(current, current);

			expect(patch.a).never.to.be.ok();
		});

		it("removed value", () => {
			const previous: { a?: number } = { a: 1 };
			const patch = createPatch(previous, {});

			expect(isNone(patch.a)).to.equal(true);
		});

		it("tables", () => {
			type Data = {
				items: Record<string, { power: number }>;
			};

			const previousData: Data = {
				items: {
					stick: { power: 1 },
					sword: { power: 10 },
				},
			};

			const newData: Data = {
				items: {
					stick: { power: 1 },
					sword: { power: 15 },
					longSword: { power: 40 },
				},
			};

			const patch = createPatch(previousData, newData);

			expect(patch.items).to.be.ok();

			expect(patch.items!["sword"]).to.be.ok();
			expect(patch.items!["longSword"]).to.be.ok();

			expect(patch.items!["stick"]!.power).never.to.be.ok();
			expect(patch.items!["sword"]!.power).to.equal(15);
			expect(patch.items!["longSword"]!.power).to.equal(40);
		});
	});

	describe("applyPatch", () => {
		it("simple types", () => {
			expect(applyPatch(1, 2)).to.equal(2);
		});

		it("no changes", () => {
			expect(applyPatch<{ a: number }>({ a: 1 }, {}).a).to.equal(1);
		});

		it("removed value", () => {
			const previous: { a?: number } = { a: 1 };
			const patch = createPatch(previous, {});

			expect(applyPatch<{ a?: number }>(previous, patch).a).never.to.be.ok();
		});

		it("tables", () => {
			type Data = {
				items: Record<string, { power: number }>;
			};

			const previousData: Data = {
				items: {
					stick: { power: 1 },
					sword: { power: 10 },
				},
			};

			const newData: Data = {
				items: {
					stick: { power: 1 },
					sword: { power: 15 },
					longSword: { power: 40 },
				},
			};

			const patch = createPatch(previousData, newData);
			const updatedData = applyPatch<Data>(previousData, patch);

			expect(updatedData.items["stick"].power).to.equal(1);
			expect(updatedData.items["sword"].power).to.equal(15);
			expect(updatedData.items["longSword"].power).to.equal(40);
		});
	});
};
