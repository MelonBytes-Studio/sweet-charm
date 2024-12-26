/// <reference types="@rbxts/testez/globals" />

import { AtomClass } from "atom-class";
import { ServerSyncer } from "server-syncer";
import { Payload } from "types";

export = function () {
	it("add & hydrate", () => {
		const syncer = new ServerSyncer();
		const atom = new AtomClass(0);

		let dispatch: Payload | undefined = undefined;

		syncer.add("atom", atom);

		syncer.watchDispatch((_, payload) => {
			dispatch = payload;
		});

		syncer.hydrate({} as Player);

		expect(dispatch).to.be.ok();
		expect(dispatch!.type).to.equal("init");
		expect(dispatch!.data["atom" as never]).to.equal(0);
	});

	it("new atom", () => {
		const syncer = new ServerSyncer();
		const atom = new AtomClass(0);

		let dispatch: Payload | undefined = undefined;

		syncer.add("atom", atom);

		syncer.watchDispatch((_, payload) => {
			dispatch = payload;
		});

		const stop = syncer.start(0);

		syncer.add("newAtom", new AtomClass(1));

		expect(dispatch).to.be.ok();
		expect(dispatch!.type).to.equal("newAtoms");
		expect(dispatch!.data["newAtom" as never]).to.equal(1);

		stop();
	});

	it("remove atom", () => {
		const syncer = new ServerSyncer();
		const atom = new AtomClass(0);

		let dispatch: Payload | undefined = undefined;

		syncer.add("atom", atom);

		syncer.watchDispatch((_, payload) => {
			dispatch = payload;
		});

		const stop = syncer.start(0);
		syncer.remove("atom");

		expect(dispatch).to.be.ok();
		expect(dispatch!.type).to.equal("removeAtoms");
		expect(dispatch!.data[1 as never]).to.equal("atom");

		stop();
	});

	it("update", () => {
		const syncer = new ServerSyncer();
		const atom = new AtomClass(0);

		let dispatch: Payload | undefined = undefined;

		syncer.add("atom", atom);

		syncer.watchDispatch((_, payload) => {
			dispatch = payload;
		});

		const stop = syncer.start(0);

		atom.update(1);
		task.wait(0.1);

		expect(dispatch).to.be.ok();
		expect(dispatch!.type).to.equal("patch");
		expect(dispatch!.data["atom" as never]).to.equal(1);

		stop();
	});

	it("parent syncer (hydrate)", () => {
		const parentSyncer = new ServerSyncer();
		const syncer = new ServerSyncer(parentSyncer);

		const parentAtom = new AtomClass(0);
		const atom = new AtomClass(0);

		let lastPayload: Payload | undefined = undefined;

		parentSyncer.add("parentAtom", parentAtom);
		syncer.add("atom", atom);

		syncer.watchDispatch((_, payload) => {
			lastPayload = payload;
		});

		const stopParentSyncer = parentSyncer.start(0);
		const stopSyncer = syncer.start(0);

		syncer.hydrate({} as Player);

		expect(lastPayload).to.be.ok();
		expect(lastPayload!.type).to.equal("init");
		expect(lastPayload!.data["parentAtom" as never]).to.equal(0);
		expect(lastPayload!.data["atom" as never]).to.equal(0);

		stopParentSyncer();
		stopSyncer();
	});

	it("parent syncer (update)", () => {
		const parentSyncer = new ServerSyncer();
		const syncer = new ServerSyncer(parentSyncer);

		const parentAtom = new AtomClass(0);
		const atom = new AtomClass(0);

		let lastPayload: Payload | undefined = undefined;

		parentSyncer.add("parentAtom", parentAtom);
		syncer.add("atom", atom);

		syncer.watchDispatch((_, payload) => {
			lastPayload = payload;
		});

		const stopParentSyncer = parentSyncer.start(0);
		const stopSyncer = syncer.start(0);

		parentAtom.update(1);
		task.wait(0.1);

		expect(lastPayload).to.be.ok();
		expect(lastPayload!.type).to.equal("patch");
		expect(lastPayload!.data["parentAtom" as never]).to.equal(1);

		lastPayload = undefined;

		stopParentSyncer();
		stopSyncer();
	});

	it("parent syncer (don't update child atom with same id)", () => {
		const parentSyncer = new ServerSyncer();
		const syncer = new ServerSyncer(parentSyncer);

		const parentAtom = new AtomClass(0);
		const atom = new AtomClass(0);

		let lastPayload: Payload | undefined = undefined;

		parentSyncer.add("atom", parentAtom);
		syncer.add("atom", atom);

		syncer.watchDispatch((_, payload) => {
			lastPayload = payload;
		});

		const stopParentSyncer = parentSyncer.start(0);
		const stopSyncer = syncer.start(0);

		parentAtom.update(1);
		task.wait(0.1);

		expect(lastPayload).never.to.be.ok();

		stopParentSyncer();
		stopSyncer();
	});
};
