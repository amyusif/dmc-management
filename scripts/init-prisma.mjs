import { execSync } from 'child_process';
import path from 'path';

const projectRoot = '/vercel/share/v0-project';

console.log('Generating Prisma client...');

try {
  execSync('npx prisma generate', {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('Prisma client generated successfully!');
} catch (error) {
  console.error('Error generating Prisma client:', error.message);
  process.exit(1);
}
