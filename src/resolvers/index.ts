import { Resolvers } from '../types/generated/graphql';
import * as query from './query';
import { dateScalar } from './scalar/date';

const resolvers: Resolvers = {
  Query: query,
  Mutation: {
    addTodo: () => null,
    updateTodo: () => null,
    deleteTodo: () => null,
    createUser: () => null,
    updateUser: () => null,
  },
  Date: dateScalar,
};

export default resolvers;
