import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server';
import { join } from 'path';
import resolvers from './resolvers';

const schema = loadSchemaSync(join(__dirname, '../schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});
const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
const server = new ApolloServer({
  schema: schemaWithResolvers,
  context: async (ctx) => {
    // TODO: tokenをdecodeしてsub取得
    const token = ctx.req.headers.authorization;
    console.log({ token });
    return {
      user: null,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
