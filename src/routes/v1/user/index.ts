import { FastifyPluginAsync } from 'fastify';
import { controllerHandlerWithUser } from '../../../models/common.js';
import { UserRoutes } from '../../../constants/routes.js';
import getInfoController from './getInfo.js';
import changePasswordController from './changePassword.js';
import saveMessagingTokenController from './saveMessagingToken.js';
import sendMessageToClientController from './sendMessageToClient.js';
// import saveCarLocationController from './car/saveCarLocation.js';
// import toggleCarCallIsReadController from './car/toggleCarCallIsRead.js';

const userControllers: FastifyPluginAsync = async (
  fastify,
  _opts
): Promise<void> => {
  fastify.get(
    UserRoutes.GetInfo,
    controllerHandlerWithUser(getInfoController, fastify)
  );

  fastify.post(
    UserRoutes.ChangePassword,
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            newPassword: { type: 'string' },
            oldPassword: { type: 'string' },
          },
        },
      },
    },
    controllerHandlerWithUser(changePasswordController, fastify)
  );

  fastify.post(
    UserRoutes.SaveMessagingToken,
    controllerHandlerWithUser(saveMessagingTokenController, fastify)
  );

  fastify.post(
    UserRoutes.SendMessageToClient,
    controllerHandlerWithUser(sendMessageToClientController, fastify)
  );
};

export default userControllers;
