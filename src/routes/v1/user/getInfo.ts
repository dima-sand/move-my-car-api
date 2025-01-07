import { Controller } from '../../../models/common.js';

const getInfoController: Controller = async (_req, reply, fastify) => {
  return {
    data: fastify.userDB.clientObject,
  };
};

export default getInfoController;
