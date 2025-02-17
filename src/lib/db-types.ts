export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface JournalRow {
  id: string;
  name: string;
  size: string;
  created_at: string;
  user_id: string;
}

export interface EntryRow {
  id: string;
  entry: string;
  created_at: string;
  last_edited_at: string;
  journal_id: string;
}

// Helper type for SQL query results
export type QueryResult<T> = Promise<T[]>;
export type SingleResult<T> = Promise<T | null>;
