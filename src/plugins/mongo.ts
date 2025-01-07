import fp from 'fastify-plugin'
import mongodb from '@fastify/mongodb';
import User from '../models/db/user/index.js';

export default fp(async (fastify) => {
  fastify.register(mongodb, {
    // force to close the mongodb connection when app stopped
    // the default value is false
    forceClose: true,
    url: process.env.DB_URL,
  });
  fastify.decorate('userDB', User.create({}));
})


declare module 'fastify' {
  interface FastifyInstance {
    userDB: User;
  }
}
