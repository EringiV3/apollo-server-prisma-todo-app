import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { join } from 'path';
import resolvers from './resolvers';

const schema = loadSchemaSync(join(__dirname, '../schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});
const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
const server = new ApolloServer({
  schema: schemaWithResolvers,
  context: async (ctx) => {
    const token = ctx.req.headers.authorization?.replace('Bearer ', '');
    if (token === undefined) {
      return {
        user: undefined,
      };
    }

    try {
      const user = await new Promise<JwtPayload>((resolve, reject) => {
        const client = jwksClient({
          jwksUri: `https://dev-f-4x-fhm.jp.auth0.com/.well-known/jwks.json`,
        });
        jwt.verify(
          token,
          (header, cb) => {
            client.getSigningKey(header.kid, function (err, key) {
              const signingKey = key.getPublicKey();
              cb(null, signingKey);
            });
          },
          {
            audience: 'https://apollo-server-prisma-todo-app.eringiv3.com',
            issuer: `https://dev-f-4x-fhm.jp.auth0.com/`,
            algorithms: ['RS256'],
          },
          (err, decoded) => {
            if (err) {
              return reject(err);
            }
            if (decoded === undefined) {
              return reject('decoded is invalid.');
            }
            resolve(decoded);
          }
        );
      });
      console.log({
        user,
      });
      return {
        user: {
          id: user.sub,
        },
      };
    } catch (error) {
      return {
        user: undefined,
      };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
