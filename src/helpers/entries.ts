import { entryService } from '../services/entryService';

export interface IJournalEntry {
  readonly id: string;
  readonly journalId: string;
  readonly created_date: string;
  last_edited_date: string;
  entry: string;
}

export async function getEntriesByJournal(
  journalId: string,
): Promise<IJournalEntry[]> {
  const entries = await entryService.getEntriesByJournalId(journalId);
  return entries.map(entry => ({
    id: entry.id,
    journalId: entry.journalId,
    created_date: entry.created_date,
    last_edited_date: entry.last_edited_date,
    entry: entry.entry,
  }));
}

export async function createEntry(journalId: string, entry: string) {
  const newEntry = await entryService.createEntry({ journalId, entry });
  return {
    id: newEntry.id,
    journalId: newEntry.journalId,
    created_date: newEntry.created_date,
    last_edited_date: newEntry.last_edited_date,
    entry: newEntry.entry,
  };
}

export async function readEntry(id: string) {
  const entry = await entryService.getEntryById(id);
  if (!entry) return null;

  return {
    id: entry.id,
    journalId: entry.journalId,
    created_date: entry.created_date,
    last_edited_date: entry.last_edited_date,
    entry: entry.entry,
  };
}

export async function updateEntry(id: string, updates: { entry: string }) {
  const entry = await entryService.updateEntry(id, updates);
  if (!entry) return null;

  return {
    id: entry.id,
    journalId: entry.journalId,
    created_date: entry.created_date,
    last_edited_date: entry.last_edited_date,
    entry: entry.entry,
  };
}

export async function deleteEntry(id: string) {
  await entryService.deleteEntry(id);
  return true;
}
