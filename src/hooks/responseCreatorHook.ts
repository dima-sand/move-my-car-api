import { FastifyReply, FastifyRequest } from 'fastify';
import { IPayloadResponse, responseCreator } from '../models/common.js';
import SuperError from '../models/errors/SuperError.js';

const responseCreatorHook = async (
  _req: FastifyRequest,
  reply: FastifyReply,
  payload: string
) => {
  try {
    const { data, error, message, status }: IPayloadResponse =
      JSON.parse(payload);
    if (error !== undefined) {
      const errorCode = (() => {
        if (typeof error?.code === 'number') {
          return error.code;
        } else return 500;
      })();
      reply.status(errorCode);
      return responseCreator({
        error: new SuperError(
          error?.message ?? message ?? '',
          status ?? errorCode!
        ),
      });
    } else {
      const _status = status ?? 200;
      reply.status(_status);
      return responseCreator({
        data,
        error,
        message,
      });
    }
  } catch (error) {
    console.error({ error });
    return responseCreator({
      error: new SuperError('Internal server error', 500),
    });
  }
};

export default responseCreatorHook;
