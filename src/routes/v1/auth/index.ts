import { FastifyPluginAsync } from 'fastify';
import registrationController from './registration.js';
import { controllerHandler } from '../../../models/common.js';
import loginController from './login.js';
import { AuthRoutes } from '../../../constants/routes.js';
import logoutController from './logout.js';

const registrationSchema = {
  body: {
    type: 'object',
    properties: {
      userName: { type: 'string' },
      password: { type: 'string' },
      carName: { type: 'string' },
      carNumber: { type: 'string' },
    },
    required: ['userName', 'password', 'carName'],
  },
};

const authControllers: FastifyPluginAsync = async (
  fastify,
  _opts
): Promise<void> => {
  fastify.post(
    AuthRoutes.Registration,
    { schema: registrationSchema },
    controllerHandler(registrationController, fastify)
  );

  fastify.post(
    AuthRoutes.Login,
    controllerHandler(loginController, fastify),
  );

  fastify.post(
    AuthRoutes.Logout,
    controllerHandler(logoutController, fastify),
  );
};

export default authControllers;
