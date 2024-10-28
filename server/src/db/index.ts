import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '../http/env.js'

export const client = postgres(env.DB_URL)
export const db = drizzle(client, { schema, logger: true })