# 🌸 Sweet Charm

Library for charm that allows to create atom classes and sync them using repositories

# ⚙️ Credits
littensy - creator of original library [Charm](https://github.com/littensy/charm)

SUMER - creator of this library (discord: sumer_real)

# 🌩 Installation
``npm install @rbxts/sweet-charm``

# 📖 Documentation

## AtomClass

```ts
const myAtom = new AtomClass(1);

const unsubscribe = myAtom.subscribe((newData) => {
	print(newData);
});

myAtom.update(10);
myAtom.update((current) => current + 100);

print("current data", myAtom.getData());
print("raw atom", myAtom.getAtom());
```

## AtomRepository

```ts
type Event = {
	name: string,
	until: number,
}

type Item = {
	name: string,
	power: number,
}

type MyAtoms = {
	events: AtomClass<Event[]>,
	items: AtomClass<Item[]>,
}

const repo = new AtomRepository<MyAtoms>();

repo.define({
	events: new AtomClass([]),
	items: new AtomClass([]),
});

print("events", repo.get("events").getData());
print("items", repo.get("items").getData());
print("all atoms", repo.getAtoms());

const subRepo = repo.subdivide();

print("parent events", subRepo.get("events"));
```

### AtomRepository syncer

```ts
type Event = {
	name: string,
	until: number,
}

type Item = {
	name: string,
	power: number,
}

type MyAtoms = {
	events: AtomClass<Event[]>,
	items: AtomClass<Item[]>,
}

const repo = new AtomRepository<MyAtoms>();

repo.define({
	events: new AtomClass([]),
	items: new AtomClass([]),
});

repo.syncer.watchDispatch((player, payload) => {
	// send payload to player somehow
})

repo.syncer.hydrate(player);  // will call watchDispatch with all atoms
repo.syncer.start(0);  // optional interval 
```

## AtomRepositoryView

```ts
type Event = {
	name: string,
	until: number,
}

type Item = {
	name: string,
	power: number,
}

type MyAtoms = {
	events: AtomClass<Event[]>,
	items: AtomClass<Item[]>,
}

const repoView = new AtomRepositoryView<MyAtoms>();

// use this method to sync payload from AtomRepository syncer
repoView.syncer.sync(payload);

print("events", repoView.get("events"));
```
