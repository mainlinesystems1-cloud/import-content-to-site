import { Pool } from "pg"

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined
}

export const pool =
  global.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool
}

export const hasDatabase = Boolean(process.env.DATABASE_URL)

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set. Connect a Postgres database (e.g. Neon) in project settings.")
    this.name = "DatabaseNotConfiguredError"
  }
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  if (!hasDatabase) throw new DatabaseNotConfiguredError()
  const result = await pool.query(text, params)
  return result.rows
}
