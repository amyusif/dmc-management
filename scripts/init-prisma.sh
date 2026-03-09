#!/bin/bash
set -e

echo "Initializing Prisma..."

# Navigate to project root
cd /vercel/share/v0-project

# Generate Prisma client
npx prisma generate

echo "Prisma client generated successfully!"
