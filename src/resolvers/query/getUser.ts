import { prisma } from '../../../src/lib/prisma';
import { QueryResolvers } from '../../types/generated/graphql';

export const getUser: QueryResolvers['getUser'] = async (
  parent,
  args,
  context,
  info
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: context.user?.id,
    },
  });
  return user;
};
