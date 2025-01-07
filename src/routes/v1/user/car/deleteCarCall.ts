import { ObjectId } from '@fastify/mongodb';
import { dbConnect } from '../../../../helpers/db/index.js';
import { Controller } from '../../../../models/common.js';
import User from '../../../../models/db/user/index.js';
import SuperError from '../../../../models/errors/SuperError.js';

const deleteCarCallController: Controller = async (
  request,
  _reply,
  fastify
) => {
  const { carId, callId } = request.body as { carId: string; callId: string };

  const db = dbConnect(fastify);

  const userWithDeletedCall = fastify.userDB.deleteCarCall(carId, callId);

  const { modifiedCount } = await db.replaceOne(
    {
      _id: new ObjectId(fastify.decodedTonen.userId),
    },
    userWithDeletedCall
  );

  if (modifiedCount === 0) {
    return {
      error: new SuperError('Error on saving car location', 500),
    };
  } else {
    return {
      data: userWithDeletedCall.clientObject,
    };
  }
};

export default deleteCarCallController;
