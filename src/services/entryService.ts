import { query, querySingle, sql } from '../lib/db';
import { EntryRow } from '../lib/db-types';

export interface CreateEntryInput {
  entry: string;
  journalId: string;
}

export interface UpdateEntryInput {
  entry?: string;
}

export const entryService = {
  async createEntry({ entry, journalId }: CreateEntryInput) {
    const newEntry = await querySingle<EntryRow>`
      INSERT INTO entries (entry, journal_id)
      VALUES (${entry}, ${journalId})
      RETURNING *
    `;

    if (!newEntry) throw new Error('Failed to create entry');

    return {
      id: newEntry.id,
      entry: newEntry.entry,
      created_date: newEntry.created_at,
      last_edited_date: newEntry.last_edited_at,
      journalId: newEntry.journal_id,
    };
  },

  async getEntriesByJournalId(journalId: string) {
    const entries = await query<EntryRow>`
      SELECT *
      FROM entries
      WHERE journal_id = ${journalId}
      ORDER BY created_at ASC
    `;

    return entries.map(entry => ({
      id: entry.id,
      entry: entry.entry,
      created_date: entry.created_at,
      last_edited_date: entry.last_edited_at,
      journalId: entry.journal_id,
    }));
  },

  async getEntryById(id: string) {
    const entry = await querySingle<EntryRow>`
      SELECT *
      FROM entries
      WHERE id = ${id}
    `;

    if (!entry) return null;

    return {
      id: entry.id,
      entry: entry.entry,
      created_date: entry.created_at,
      last_edited_date: entry.last_edited_at,
      journalId: entry.journal_id,
    };
  },

  async updateEntry(id: string, updates: UpdateEntryInput) {
    if (!updates.entry) return null;

    const entry = await querySingle<EntryRow>`
      UPDATE entries
      SET entry = ${updates.entry},
          last_edited_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (!entry) return null;

    return {
      id: entry.id,
      entry: entry.entry,
      created_date: entry.created_at,
      last_edited_date: entry.last_edited_at,
      journalId: entry.journal_id,
    };
  },

  async deleteEntry(id: string) {
    await sql`
      DELETE FROM entries
      WHERE id = ${id}
    `;
    return true;
  },
};
