import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { env } from '@/env/server'

export default defineConfig({
  out: './drizzle',
  schema: './app/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL
  },
})
