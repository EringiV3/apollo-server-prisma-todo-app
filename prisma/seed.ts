import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  const users = await createUsers();
  const promises = users.map((user) => {
    return createTodos(user);
  });
  const todos = await Promise.all(promises);
  console.log({
    users,
    todos,
  });
};

const createUsers = async () => {
  const promises = [...Array(3)].map((_, i) => {
    const userId = `${i + 1}`;
    return prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: `seed_user_${userId}`,
      },
    });
  });
  return await Promise.all(promises);
};

const createTodos = async (user: User) => {
  const promises = [...Array(3)].map((_, i) => {
    const number = i + 1;
    return prisma.todo.create({
      data: {
        title: `${user.name}_todo_${number}_title`,
        userId: user.id,
        status: 'pending',
      },
    });
  });
  return await Promise.all(promises);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
