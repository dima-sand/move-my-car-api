import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import SuperError from './errors/SuperError.js';
import { dbConnect } from '../helpers/db/index.js';
import { ObjectId } from '@fastify/mongodb';
import User from './db/user/index.js';
import { deleteCookie } from '../helpers/cookie/index.js';
import { TokenTypes } from './token/index.js';

export interface IResponse {
  success: boolean;
  message?: string | null;
  data: any;
}

export interface IPayloadResponse<S = any> {
  error?: SuperError;
  message?: string;
  status?: number;
  data?: S;
}

export const responseCreator = ({
  data,
  error,
  message,
}: IPayloadResponse): IResponse => ({
  success: error ? false : true,
  message: error || message ? error?.message ?? message : null,
  data,
});

export const handleResponse = () => {};

export type Controller<T = any> = (
  request: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) => Promise<IPayloadResponse<T>>;

export const controllerHandlerWithUser =
  (controller: Controller, fastify?: FastifyInstance) =>
  async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<IPayloadResponse> => {
    try {
      if (fastify === undefined) {
        throw Error('fastify instance must be passed');
      } else {
        const userDB = await dbConnect(fastify).findOne({
          _id: new ObjectId(fastify.decodedTonen.userId),
        });

        if (!userDB) {
          return {
            error: new SuperError('User not found', 404),
          };
        } else {
          const user = User.from(userDB);
          if (user.accessToken !== fastify.access_token) {
            deleteCookie(reply, TokenTypes.Access);
            return {
              error: new SuperError('Unauthorized', 401),
            };
          } else {
            fastify.userDB = user;
            return await controller(request, reply, fastify);
          }
        }
      }
    } catch (error) {
      console.log({ error });
      return {
        error: new SuperError('Internal server error'),
      };
    }
  };

export const controllerHandler =
  (controller: Controller, fastify?: FastifyInstance) =>
  async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<IPayloadResponse> => {
    try {
      if (fastify === undefined) {
        throw Error('fastify instance must be passed');
      } else return await controller(request, reply, fastify);
    } catch (error) {
      console.log({ error });
      return {
        error: new SuperError('Internal server error'),
      };
    }
  };
