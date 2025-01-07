import fp from 'fastify-plugin'
import { ITokenData, TokenTypes } from '../models/token/index.js';

export default fp(async (fastify, _opts) => {
  fastify.decorate(TokenTypes.Access, '');
  fastify.decorate(TokenTypes.Refresh, '');
  fastify.decorate(TokenTypes.Decoded);
})

declare module 'fastify' {
  export interface FastifyInstance {
    [TokenTypes.Access]: string;
    [TokenTypes.Refresh]: string;
    [TokenTypes.Decoded]: ITokenData;
  }
}
