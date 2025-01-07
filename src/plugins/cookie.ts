import fp from 'fastify-plugin'
import cookie, { FastifyCookieOptions } from '@fastify/cookie';

export default fp(async (fastify) => {
  fastify.register(cookie, {
    hook: 'onRequest',
  } as FastifyCookieOptions,);  
});
