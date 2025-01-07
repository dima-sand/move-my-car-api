import { ObjectId } from '@fastify/mongodb';
import { dbConnect } from '../../../../helpers/db/index.js';
import { Controller } from '../../../../models/common.js';
import User from '../../../../models/db/user/index.js';
import SuperError from '../../../../models/errors/SuperError.js';
import Car from '../../../../models/db/car/index.js';

const saveVehicleInfoController: Controller = async (
  request,
  _reply,
  fastify
) => {
  const updatedVehicle = request.body;

  const userWithUpdatedCarInfo =
    fastify.userDB.updateCarInfoById(updatedVehicle);

  const { modifiedCount } = await dbConnect(fastify).replaceOne(
    {
      _id: userWithUpdatedCarInfo._id,
    },
    userWithUpdatedCarInfo
  );

  if (modifiedCount === 0) {
    return {
      error: new SuperError('Error on saving car location', 500),
    };
  } else {
    return {
      data: userWithUpdatedCarInfo.clientObject,
    };
  }
};

export default saveVehicleInfoController;
