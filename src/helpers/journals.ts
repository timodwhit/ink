import { journalService } from '../services/journalService';
import { deleteEntry, getEntriesByJournal } from './entries';

export interface IJournal {
  readonly id: string;
  readonly created_date: string;
  name: string;
  size: 'small' | 'medium' | 'large';
}

export async function getJournals(userId: string): Promise<IJournal[]> {
  const journals = await journalService.getJournalsByUserId(userId);
  return journals.map(journal => ({
    id: journal.id,
    created_date: journal.created_date,
    name: journal.name,
    size: journal.size as 'small' | 'medium' | 'large',
  }));
}

export async function createJournal(
  name: string,
  size: 'small' | 'medium' | 'large',
  userId: string,
) {
  const journal = await journalService.createJournal({ name, size, userId });
  return {
    id: journal.id,
    created_date: journal.created_date,
    name: journal.name,
    size: journal.size as 'small' | 'medium' | 'large',
  };
}

export async function getJournal(id: string) {
  const journal = await journalService.getJournalById(id);
  if (!journal) return undefined;

  return {
    id: journal.id,
    created_date: journal.created_date,
    name: journal.name,
    size: journal.size as 'small' | 'medium' | 'large',
  };
}

export async function updateJournal(id: string, updates: { name?: string; size?: 'small' | 'medium' | 'large' }) {
  const journal = await journalService.updateJournal(id, updates);
  if (!journal) return null;

  return {
    id: journal.id,
    created_date: journal.created_date,
    name: journal.name,
    size: journal.size as 'small' | 'medium' | 'large',
  };
}

export async function deleteJournal(id: string) {
  const entries = await getEntriesByJournal(id);
  for (const entry of entries) {
    await deleteEntry(entry.id);
  }
  await journalService.deleteJournal(id);
  return true;
}
