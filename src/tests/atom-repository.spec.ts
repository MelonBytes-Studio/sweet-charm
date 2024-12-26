/// <reference types="@rbxts/testez/globals" />

import { AtomClass } from "atom-class";
import { AtomRepository } from "atom-repository";

export = function () {
	it("define & get", () => {
		const repo = new AtomRepository<{
			name: AtomClass<string>;
			age: AtomClass<number>;
		}>();

		repo.define({
			name: new AtomClass("John"),
			age: new AtomClass(20),
		});

		expect(repo.get("name").getData()).to.equal("John");
		expect(repo.get("age").getData()).to.equal(20);

		expect(() => {
			repo.get("unknown" as never);
		}).to.throw();
	});

	it("getAtoms", () => {
		const repo = new AtomRepository<{
			name: AtomClass<string>;
		}>();

		repo.define({
			name: new AtomClass("John"),
		});

		expect(repo.getAtoms().name!.getData()).to.equal("John");
	});

	it("remove", () => {
		const repo = new AtomRepository<{
			name: AtomClass<string>;
		}>();

		repo.define({
			name: new AtomClass("John"),
		});

		expect(repo.get("name")).to.be.ok();

		repo.remove("name");

		expect(repo.getAtoms().name).never.to.be.ok();
	});

	it("subdivide", () => {
		const repo = new AtomRepository<{
			name: AtomClass<string>;
			age: AtomClass<number>;
		}>();

		const subRepo = repo.subdivide();

		repo.define({
			name: new AtomClass("John"),
		});

		subRepo.define({
			age: new AtomClass(20),
		});

		expect(subRepo.get("name").getData()).to.equal("John");
		expect(subRepo.get("age").getData()).to.equal(20);

		subRepo.define({
			name: new AtomClass("Jane"),
		});

		expect(subRepo.get("name").getData()).to.equal("Jane");
	});
};
