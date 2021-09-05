import { prisma } from '../../lib/prisma';
import { MutationResolvers } from '../../types/generated/graphql';

export const updateTodo: MutationResolvers['updateTodo'] = async (
  parent,
  args,
  context,
  info
) => {
  const userId = context.user?.id;
  if (!userId) {
    throw new Error('Authentication Error.');
  }

  const targetTodo = await prisma.todo.findUnique({
    where: {
      id: args.id,
    },
  });

  if (!targetTodo) {
    throw new Error('Not Found Todo.');
  }

  if (targetTodo.userId !== userId) {
    throw new Error('Authorization Error.');
  }

  const todo = await prisma.todo.update({
    where: {
      id: args.id,
    },
    data: {
      title: args.input.title,
      status: args.input.status,
    },
    include: {
      user: true,
    },
  });
  return todo;
};
