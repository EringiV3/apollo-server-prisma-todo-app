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
    include: {
      user: true,
    },
  });
  return todos;
};
