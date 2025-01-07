import { FastifyInstance } from 'fastify';
import { IResponse } from '../models/common.js';
import responseCreatorHook from './responseCreatorHook.js';
import localizationHook from './languageHook.js';
import validateToken from './validateToken.js';

const addCustomHooks = (fastify: FastifyInstance) => {
  fastify.addHook('preParsing', localizationHook(fastify));

  fastify.addHook('preParsing', validateToken(fastify));

  fastify.addHook('onSend', responseCreatorHook);
  fastify.addHook('onSend', async (_req, _reply, payload: IResponse) =>
    JSON.stringify(payload)
  );
};

export default addCustomHooks;
