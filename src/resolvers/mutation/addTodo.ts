import { prisma } from '../../lib/prisma';
import { MutationResolvers } from '../../types/generated/graphql';

export const addTodo: MutationResolvers['addTodo'] = async (
  parent,
  args,
  context,
  info
) => {
  const userId = context.user?.id;
  if (!userId) {
    throw new Error('Authrization Error.');
  }
  const todo = await prisma.todo.create({
    data: {
      title: args.input.title,
      status: 'pending',
      userId: userId,
    },
    include: {
      user: true,
    },
  });
  return todo;
};
