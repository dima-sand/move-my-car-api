import { FastifyPluginAsync } from 'fastify';
import { UserCarRoutes } from '../../../../constants/routes.js';
import { controllerHandler, controllerHandlerWithUser } from '../../../../models/common.js';
import toggleCarCallIsReadController from './toggleCarCallIsRead.js';
import saveCarLocationController from './saveCarLocation.js';
import deleteCarCallController from './deleteCarCall.js';
import addNewCarController from './addNewCar.js';
import saveCarInfoController from './saveCarInfo.js';

const userCarControllers: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.post(
    UserCarRoutes.SaveCarLocation,
    controllerHandlerWithUser(saveCarLocationController, fastify)
  );

  fastify.post(
    UserCarRoutes.ToggleCarCallIsRead,
    controllerHandlerWithUser(toggleCarCallIsReadController, fastify)
  );

  fastify.post(
    UserCarRoutes.DeleteCarCall,
    controllerHandlerWithUser(deleteCarCallController, fastify)
  );

  fastify.post(
    UserCarRoutes.AddNewCar,
    controllerHandler(addNewCarController, fastify)
  )
  fastify.post(
    UserCarRoutes.SaveCarInfo,
    controllerHandlerWithUser(saveCarInfoController, fastify)
  )
};

export default userCarControllers;
