// credits to littensy @rbxts/charm-sync
/* eslint-disable @typescript-eslint/no-explicit-any */
const NONE = { __none: "__none" };

export type DeepPartialWithNone<T> = T extends object
	? { [K in keyof T]?: DeepPartialWithNone<T[K]> }
	: T | typeof NONE;

export function isNone(value: unknown): value is typeof NONE {
	return typeOf(value) === "table" && (value as { __none?: string }).__none === "__none";
}

export function isEmptyTable(value: unknown): value is {} {
	if (typeOf(value) !== "table") {
		return false;
	}

	const [key] = next(value as object);
	return key === undefined;
}

export function isSparseArray(value: any): value is any[] {
	if (typeOf(value) !== "table") {
		return false;
	}

	const maxn = (table as unknown as { maxn: (t: object) => number }).maxn;

	const maxIndex = maxn(value);
	const length = (value as unknown as unknown[]).size();

	return maxIndex === 0 ? false : maxIndex !== length;
}

export function serializeSparseArray<T>(toSerialize: T): T extends (number | undefined)[] ? Record<string, any> : T {
	if (!isSparseArray(toSerialize)) {
		return toSerialize as any;
	}

	const serializedSparseArray = {} as Record<string, any>;

	for (const [index, value] of pairs(toSerialize as Record<number, any>)) {
		serializedSparseArray[tostring(index)] = value;
	}

	return serializedSparseArray as any;
}

export function createPatch<T extends object>(
	previous: T,
	nextState: T,
	shallSerializeSparseArray: boolean = true,
): DeepPartialWithNone<T> {
	const patch = table.clone(nextState) as DeepPartialWithNone<{ [key: string | number]: unknown }>;

	for (const [key, value] of pairs(previous)) {
		const nextValue = patch[key as string | number];

		if (value === nextValue) {
			patch[key as any] = undefined as any;
			continue;
		}

		if (nextValue === undefined) {
			patch[key as any] = NONE;
			continue;
		}

		if (typeOf(nextValue) === "table" && typeOf(value) === "table") {
			patch[key as any] = createPatch(value as any, nextValue);
			continue;
		}
	}

	if (shallSerializeSparseArray) {
		return serializeSparseArray(patch) as DeepPartialWithNone<T>;
	}

	return patch as DeepPartialWithNone<T>;
}

export function applyPatch<T>(current: T, patch: DeepPartialWithNone<T>): T {
	if (isNone(patch)) {
		return undefined as T;
	}

	if (typeOf(patch) !== "table" || typeOf(current) !== "table") {
		return patch as T;
	}

	const newState = table.clone(current as Record<string | number, any>);
	const isArray = (newState[1] as unknown) !== undefined;

	for (const [key, value] of pairs(patch as DeepPartialWithNone<object>)) {
		let index = key;

		if (isArray && typeOf(key) === "string") {
			index = tonumber(key)!;
		}

		newState[index as any] = applyPatch(newState[index as keyof typeof newState], value);
	}

	return newState as T;
}
