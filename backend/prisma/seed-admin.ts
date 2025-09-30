// Seed Admin User
// This script creates an initial admin user for the CMS

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating admin user...');

  const email = 'admin@example.com';
  const password = 'admin123'; // Change this in production
  const passwordHash = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    console.log('Admin user already exists');
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: 'admin'
    }
  });

  console.log('Admin user created successfully:');
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  ID: ${user.id}`);
  console.log('\n⚠️  IMPORTANT: Change the password after first login!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });