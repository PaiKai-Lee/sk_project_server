import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

enum Role {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  User = 'User',
}

const prisma = new PrismaClient();

async function main() {
  const hashPassword = await bcrypt.hash('66666666', 10);
  const superAdmin = {
    name: 'superAdmin',
    password: hashPassword,
    email: 'superAdmin@sk.com',
    role: Role.SuperAdmin,
    department: 'SuperAdmin',
  };

  const users = [];

  for (let i = 0; i < 10; i++) {
    const hashPassword = await bcrypt.hash('66666666', 10);
    const userInfo = {
      name: `testUser_${i}`,
      password: hashPassword,
      email: `testUser_${i}@sk.com`,
      role: Role.User,
      department: 'temp',
      points: 8888,
    };

    users.push(userInfo);
  }

  const bankruptUser = {
    name: 'testUser_x',
    password: await bcrypt.hash('66666666', 10),
    email: 'testUser_x@sk.com',
    role: Role.User,
    department: 'temp',
    points: -400,
  };

  await prisma.user.createMany({
    data: [superAdmin, bankruptUser, ...users],
  });
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
