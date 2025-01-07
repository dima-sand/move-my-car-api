import { ObjectId } from '@fastify/mongodb';
import { dbConnect } from '../../../../helpers/db/index.js';
import { Controller } from '../../../../models/common.js';
import SuperError from '../../../../models/errors/SuperError.js';
import { ICarLocation } from '../../../../models/db/car/index.js';

interface ISaveCarLocationPayload {
  carId: string;
  carLocation: ICarLocation | null;
}

const saveCarLocationController: Controller = async (
  request,
  _reply,
  fastify
) => {
  const payload = request.body as ISaveCarLocationPayload;
  const decodedTonen = fastify.decodedTonen;
  const db = dbConnect(fastify);

  const userWithUpdatedCarLocation = fastify.userDB.saveCarLocation(
    payload.carId,
    payload.carLocation
  );

  const { modifiedCount } = await db.replaceOne(
    {
      _id: new ObjectId(decodedTonen.userId),
    },
    userWithUpdatedCarLocation
  );

  if (modifiedCount === 1) {
    return {
      data: payload,
    };
  } else {
    return {
      error: new SuperError('Error on saving car location', 500),
    };
  }
};

export default saveCarLocationController;
