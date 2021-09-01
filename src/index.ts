import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import fetch from 'node-fetch';
import { join } from 'path';
import {
  APOLLO_SERVER_PORT,
  AUTH0_AUDIENCE,
  AUTH0_DOMAIN,
} from './config/constants';
import resolvers from './resolvers';
import { Context } from './types/context';

const schema = loadSchemaSync(join(__dirname, '../schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});
const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
const server = new ApolloServer({
  schema: schemaWithResolvers,
  cors: true,
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
          jwksUri: `${AUTH0_DOMAIN}/.well-known/jwks.json`,
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
            audience: `${AUTH0_AUDIENCE}`,
            issuer: `${AUTH0_DOMAIN}/`,
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

      const userInfo = await fetch(`${AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());

      return {
        user: {
          id: user.sub,
          name: userInfo.nickname,
          email: userInfo.email,
        },
      } as Context;
    } catch (error) {
      return {
        user: undefined,
      };
    }
  },
});

server.listen({ port: APOLLO_SERVER_PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
