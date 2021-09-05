import { prisma } from '../../lib/prisma';
import { MutationResolvers } from '../../types/generated/graphql';

export const deleteTodo: MutationResolvers['deleteTodo'] = async (
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

  const todo = await prisma.todo.delete({
    where: {
      id: args.id,
    },
    include: {
      user: true,
    },
  });
  return todo;
};
