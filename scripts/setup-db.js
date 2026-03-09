import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

// Set DATABASE_URL from command line argument or environment
const databaseUrl = process.argv[2] || process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('Error: DATABASE_URL not provided')
  console.error('Usage: node scripts/setup-db.js <database_url>')
  process.exit(1)
}

console.log('[v0] Setting up database...')
console.log('[v0] DATABASE_URL:', databaseUrl.substring(0, 30) + '...')

// Create .env.local file
const envContent = `DATABASE_URL="${databaseUrl}"\n`
fs.writeFileSync(path.join(projectRoot, '.env.local'), envContent)
console.log('[v0] Created .env.local')

// Run prisma generate
console.log('[v0] Running prisma generate...')
const generateResult = spawnSync('npx', ['prisma', 'generate'], {
  cwd: projectRoot,
  stdio: 'inherit',
})

if (generateResult.status !== 0) {
  console.error('[v0] Failed to generate Prisma client')
  process.exit(1)
}

console.log('[v0] Prisma client generated successfully')

// Run prisma db push
console.log('[v0] Pushing schema to database...')
const pushResult = spawnSync('npx', ['prisma', 'db', 'push', '--skip-generate'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: databaseUrl },
})

if (pushResult.status !== 0) {
  console.error('[v0] Failed to push schema to database')
  process.exit(1)
}

console.log('[v0] Database schema created successfully')
console.log('[v0] Setup complete!')
