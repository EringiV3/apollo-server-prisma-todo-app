import { prisma } from '../../lib/prisma';
import { QueryResolvers } from '../../types/generated/graphql';

export const getTodos: QueryResolvers['getTodos'] = async (
  parent,
  args,
  context,
  info
) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId: context.user?.id,
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id: context.user?.id,
    },
  });
  if (!user) {
    throw new Error('Not Found Error.');
  }
  return todos.map((todo) => ({ ...todo, user }));
};
