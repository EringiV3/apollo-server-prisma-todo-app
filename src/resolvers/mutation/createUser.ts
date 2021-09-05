import { prisma } from '../../lib/prisma';
import { MutationResolvers } from '../../types/generated/graphql';

export const createUser: MutationResolvers['createUser'] = async (
  parent,
  args,
  context,
  info
) => {
  const userId = context.user?.id;
  if (!userId) {
    throw new Error('Authentication Error.');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  console.log({ user });

  if (user) {
    throw new Error('Alredy exists user.');
  }

  const createdUser = await prisma.user.create({
    data: {
      id: userId,
      name: args.input.name,
    },
  });
  return createdUser;
};
