import { neon, neonConfig } from '@neondatabase/serverless';
import { QueryResult, SingleResult } from './db-types';

neonConfig.fetchConnectionCache = true;

if (!import.meta.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const rawSql = neon(import.meta.env.DATABASE_URL);

export async function query<T>(
  strings: TemplateStringsArray,
  ...values: any[]
): QueryResult<T> {
  return rawSql(strings, ...values) as Promise<T[]>;
}

export async function querySingle<T>(
  strings: TemplateStringsArray,
  ...values: any[]
): SingleResult<T> {
  const results = await rawSql(strings, ...values) as T[];
  return results[0] || null;
}

export { rawSql as sql };
