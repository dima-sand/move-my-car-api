import { ObjectId } from '@fastify/mongodb';
import { dbConnect } from '../../../../helpers/db/index.js';
import { Controller } from '../../../../models/common.js';
import SuperError from '../../../../models/errors/SuperError.js';
import User from '../../../../models/db/user/index.js';

const toggleCarCallIsReadController: Controller = async (
  request,
  _reply,
  fastify
) => {
  const { carId, callId } = request.body as { carId: string; callId: string };

  const userWithUpdatedCall = fastify.userDB.toggleCarCallisRead(carId, callId);

  const { modifiedCount } = await dbConnect(fastify).replaceOne(
    { _id: userWithUpdatedCall._id },
    userWithUpdatedCall
  );
  if (modifiedCount === 0) {
    return {
      error: new SuperError('Error on saving car location', 500),
    };
  } else {
    return {
      data: userWithUpdatedCall.clientObject,
    };
  }
};

export default toggleCarCallIsReadController;
