/// <reference types="@rbxts/testez/globals" />

import { AtomClass } from "atom-class";
import { AtomRepositoryView } from "atom-repository-view";

export = function () {
	it("get", () => {
		const repo = new AtomRepositoryView<{
			money: AtomClass<number>;
		}>();

		expect(() => {
			repo.get("money");
		}).to.throw();

		repo.syncer.sync({
			type: "init",
			data: {
				money: 100,
			},
		});

		expect(repo.get("money").getData()).to.equal(100);
	});
};
