import { ObjectId } from '@fastify/mongodb';
import { dbConnect } from '../../../../helpers/db/index.js';
import { Controller } from '../../../../models/common.js';
import User from '../../../../models/db/user/index.js';
import Car from '../../../../models/db/car/index.js';
import SuperError from '../../../../models/errors/SuperError.js';

const addNewCarController: Controller = async (request, _reply, fastify) => {
  const newCar = Car.from(request.body);

  const { userId } = fastify.decodedTonen;

  const db = dbConnect(fastify);

  const update: Record<string, any> = {
    $push: {
      cars: newCar,
    },
  };

  const { modifiedCount } = await db.updateOne(
    {
      _id: new ObjectId(userId),
    },
    update
  );

  if (modifiedCount === 0) {
    return {
      error: new SuperError('Error on saving car location', 500),
    };
  } else {
    const updatedUser = await db.findOne({
      _id: new ObjectId(fastify.decodedTonen.userId),
    });
    return {
      data: User.from(updatedUser).clientObject,
    };
  }
};

export default addNewCarController;
