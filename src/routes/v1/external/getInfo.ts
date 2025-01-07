import { DBcollectionNames } from '../../../constants/db.js';
import { dbConnect } from '../../../helpers/db/index.js';
import { Controller } from '../../../models/common.js';
import SuperError from '../../../models/errors/SuperError.js';
import User from '../../../models/db/user/index.js';

interface IGetInfoPayload {
  userName: string;
  carId: string;
}

const getInfoExternalController: Controller = async (
  request,
  _reply,
  fastify
) => {
  try {
    const { userName, carId } = request.query as IGetInfoPayload;

    const db = dbConnect(fastify, DBcollectionNames.Users);

    const match = await db.findOne({ userName });

    if (match === null) {
      return {
        error: new SuperError('userNotFound', 404),
      };
    }

    const user = User.from(match);

    const data = user.getUserInfoForExternal(carId);

    return {
      data,
    };
  } catch (error) {
    return {
      error: new SuperError('Error on calling', 500),
    };
  }
};

export default getInfoExternalController;
