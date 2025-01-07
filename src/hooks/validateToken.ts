import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ITokenData, TokenTypes } from '../models/token/index.js';
import TokenService from '../services/tokenService/index.js';
import SuperError from '../models/errors/SuperError.js';
import { validateTokenExceptions } from '../constants/routes.js';

const validateToken =
  (fastify: FastifyInstance) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    const isException = validateTokenExceptions.some(path =>
      req.url.includes(path)
    );
    if (!isException) {
      const accessToken = req.cookies[TokenTypes.Access];
      if (accessToken === undefined) {
        reply.send({
          error: new SuperError('Tokens are not provided', 401),
        });
      } else {
        const decodedToken = TokenService.decodeToken(
          accessToken
        ) as ITokenData;
        fastify.decodedTonen = decodedToken;
        fastify.access_token = accessToken;
      }
    }
  };

export default validateToken;
