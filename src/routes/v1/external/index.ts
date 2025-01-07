import { FastifyPluginAsync } from 'fastify';
import { controllerHandler, controllerHandlerWithUser } from '../../../models/common.js';
import callUserController from './callUser.js';
import { ExternalRoutes } from '../../../constants/routes.js';
import getInfoExternalController from './getInfo.js';

const userControllers: FastifyPluginAsync = async (
  fastify,
  _opts
): Promise<void> => {
  fastify.get(
    ExternalRoutes.GetInfoExt,
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            userName: { type: 'string' },
          },
        },
      },
    },
    controllerHandler(getInfoExternalController, fastify)
  );

  fastify.post(
    ExternalRoutes.CallUser,
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            userName: { type: 'string' },
            carId: { type: 'string' },
          },
        },
      },
    },
    controllerHandler(callUserController, fastify)
  );
};

export default userControllers;
