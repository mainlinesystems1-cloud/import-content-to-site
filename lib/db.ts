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

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  try {
    const result = await pool.query(text, params)
    return result.rows
  } catch (error) {
    const code = error instanceof Error && "code" in error ? error.code : undefined
    const isReadQuery = /^\s*(SELECT|WITH)\b/i.test(text)
    const isUnavailableRead = isReadQuery && (code === "ECONNREFUSED" || code === "42P01")
    const isPreviewWithoutDatabase = process.env.NODE_ENV !== "production" && isUnavailableRead
    const isBuildWithoutSchema = process.env.NODE_ENV === "production" && code === "42P01"

    if (isBuildWithoutSchema) {
      console.warn("[v0] Release tables are not available during the build; returning an empty result.")
      return []
    }

    if (isPreviewWithoutDatabase) {
      console.warn("[v0] Database is unavailable in the preview; returning an empty result for a read query.")
      return []
    }

    throw error
  }
}
