import { query, querySingle, sql } from '../lib/db';
import { JournalRow } from '../lib/db-types';

export interface CreateJournalInput {
  name: string;
  size: 'small' | 'medium' | 'large';
  userId: string;
}

export interface UpdateJournalInput {
  name?: string;
  size?: 'small' | 'medium' | 'large';
}

export const journalService = {
  async createJournal({ name, size, userId }: CreateJournalInput) {
    const journal = await querySingle<JournalRow>`
      INSERT INTO journals (name, size, user_id)
      VALUES (${name}, ${size}, ${userId})
      RETURNING *
    `;

    if (!journal) throw new Error('Failed to create journal');

    return {
      id: journal.id,
      name: journal.name,
      size: journal.size as 'small' | 'medium' | 'large',
      created_date: journal.created_at,
      user_id: journal.user_id,
    };
  },

  async getJournalsByUserId(userId: string) {
    const journals = await query<JournalRow>`
      SELECT *
      FROM journals
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return journals.map(journal => ({
      id: journal.id,
      name: journal.name,
      size: journal.size as 'small' | 'medium' | 'large',
      created_date: journal.created_at,
      user_id: journal.user_id,
    }));
  },

  async getJournalById(id: string) {
    const journal = await querySingle<JournalRow>`
      SELECT *
      FROM journals
      WHERE id = ${id}
    `;

    if (!journal) return null;

    return {
      id: journal.id,
      name: journal.name,
      size: journal.size as 'small' | 'medium' | 'large',
      created_date: journal.created_at,
      user_id: journal.user_id,
    };
  },

  async updateJournal(id: string, updates: UpdateJournalInput) {
    if (!updates.name && !updates.size) return null;

    const setClauses = [];
    const values = [];

    if (updates.name) {
      setClauses.push('name = ${updates.name}');
    }
    if (updates.size) {
      setClauses.push('size = ${updates.size}');
    }

    const journal = await querySingle<JournalRow>`
      UPDATE journals
      SET ${sql(setClauses.join(', '))}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!journal) return null;

    return {
      id: journal.id,
      name: journal.name,
      size: journal.size as 'small' | 'medium' | 'large',
      created_date: journal.created_at,
      user_id: journal.user_id,
    };
  },

  async deleteJournal(id: string) {
    await sql`
      DELETE FROM journals
      WHERE id = ${id}
    `;
    return true;
  },
};
