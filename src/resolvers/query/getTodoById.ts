import { prisma } from '../../lib/prisma';
import { QueryResolvers } from '../../types/generated/graphql';

export const getTodoById: QueryResolvers['getTodoById'] = async (
  parent,
  args,
  context,
  info
) => {
  const todo = await prisma.todo.findUnique({
    where: {
      id: args.id,
    },
  });
  if (!todo) {
    throw new Error('Not Found Todo.');
  }
  const user = await prisma.user.findUnique({
    where: {
      id: context.user?.id,
    },
  });
  if (!user) {
    throw new Error('Not Found Error.');
  }
  return { ...todo, user };
};
