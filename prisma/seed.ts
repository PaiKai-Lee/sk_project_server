import { PrismaClient } from '@prisma/client';

enum Role {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  User = 'User',
}

const prisma = new PrismaClient();

async function main() {
  const superAdmin = {
    name: 'superAdmin',
    password: '66666666',
    email: 'superAdmin@sk.com',
    role: Role.SuperAdmin,
    department: 'SuperAdmin',
  };

  const users = [];

  for (let i = 0; i < 10; i++) {
    const userInfo = {
      name: `testUser_${i}`,
      password: '66666666',
      email: `testUser_${i}@sk.com`,
      role: Role.User,
      department: 'temp',
      points: 8888,
    };

    users.push(userInfo);
  }

  const bankruptUser = {
    name: 'testUser_x',
    password: '66666666',
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
