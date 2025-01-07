import { FastifyPluginAsync } from 'fastify';
import { controllerHandlerWithUser, IPayloadResponse } from '../../../models/common.js';

const healthCheck: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.get('/', function (): IPayloadResponse<string> {
    return {
      data: 'Success',
    };
  });
};

export default healthCheck;
