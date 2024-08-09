import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";
import { deleteEntry, getEntriesByJournal } from "./entries.ts";

export interface IJournal {
	readonly id: string;
	readonly created_date: Date;
	name: string;
	size: "small" | "medium" | "large";
}

export async function getJournals(): Promise<IJournal[]> {
	return (await localforage.getItem("journals")) ?? [];
}
export async function createJournal(
	name: string,
	size: "small" | "medium" | "large",
) {
	const id = uuidv4();
	const journal: IJournal = {
		id,
		name,
		created_date: new Date(),
		size,
	};
	const journals = await getJournals();
	journals.unshift(journal);
	await setJournals(journals);
	return journal;
}

export async function getJournal(id: string) {
	const journals = await getJournals();
	return journals.find((journal) => journal.id === id);
}

export async function updateJournal(id: string, updates) {
	const journals = await getJournals();
	const journal = journals.find((journal) => journal.id === id);
	if (!journal) {
		throw new Error(`No journal found for ${id}`);
	}
	Object.assign(journal, updates);
	// Save the changes.
	await setJournals(journals);
	return journal;
}

export async function deleteJournal(id: string) {
	const journals = await getJournals();
	const index = journals.findIndex((contact) => contact.id === id);
	if (index > -1) {
		journals.splice(index, 1);
		await setJournals(journals);
		const entries = await getEntriesByJournal(id);
		for (const entry of entries) {
			await deleteEntry(entry.id);
		}
		return true;
	}
	return false;
}

function setJournals(journals: IJournal[]) {
	return localforage.setItem("journals", journals);
}
