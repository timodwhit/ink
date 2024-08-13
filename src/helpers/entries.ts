import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";

export interface IJournalEntry {
  readonly journalId: string;
  readonly id: string;
  readonly created_date: Date;
  last_edited_date: Date;
  entry: string;
}

async function getAllEntries(): Promise<Map<string, IJournalEntry>> {
  return (await localforage.getItem("entries")) ?? new Map();
}

export async function getEntriesByJournal(
  journalId: string,
): Promise<IJournalEntry[]> {
  const allEntries = (await getAllEntries()) ?? {};
  const journalEntries: IJournalEntry[] = [];
  //Note: This array generation is temporary, until a real database comes into the picture.
  for (const [, entry] of allEntries) {
    if (entry.journalId === journalId) {
      journalEntries.push(entry);
    }
  }
  return journalEntries;
}

export async function createEntry(journalId: string, node: string) {
  const id = uuidv4();
  const entry: IJournalEntry = {
    id,
    journalId,
    entry: node,
    created_date: new Date(),
    last_edited_date: new Date(),
  };
  const entries = await getAllEntries();
  entries.set(id, entry);
  await setEntries(entries);
  return entry;
}

export async function readEntry(id: string) {
  const entries = await getAllEntries();
  return entries.get(id);
}

export async function updateEntry(id: string, updates) {
  const entries = await getAllEntries();
  const entry = entries.get(id);
  if (!entry) {
    throw new Error(`No entry found for ${id}`);
  }
  Object.assign(entry, { ...updates, last_edited_date: new Date() });
  // Save the changes.
  await setEntries(entries);
  return entry;
}

export async function deleteEntry(id: string) {
  const entries = await getAllEntries();
  const deleted = entries.delete(id);
  if (deleted) {
    await setEntries(entries);
    return true;
  }
  return false;
}

function setEntries(entries: Map<string, IJournalEntry>) {
  return localforage.setItem("entries", entries);
}
