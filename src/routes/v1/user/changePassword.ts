import { ObjectId } from '@fastify/mongodb';
import { DBcollectionNames } from '../../../constants/db.js';
import { dbConnect } from '../../../helpers/db/index.js';
import { Controller } from '../../../models/common.js';
import SuperError from '../../../models/errors/SuperError.js';
import User from '../../../models/db/user/index.js';
import { encryptString } from '../../../helpers/crypto/index.js';

interface IChangePasswordPayload {
  newPassword: string;
  oldPassword: string;
}

const changePasswordController: Controller = async (
  request,
  _reply,
  fastify
) => {
  const { oldPassword, newPassword } = request.body as IChangePasswordPayload;

  if (!(await fastify.userDB.checkPassword(oldPassword))) {
    return {
      error: new SuperError('Wrong password', 401),
    };
  } else {
    const userWithUpdatedPassword = await fastify.userDB.changePassword(
      newPassword,
      oldPassword
    );
    const { acknowledged } = await dbConnect(fastify).replaceOne(
      { _id: userWithUpdatedPassword._id },
      userWithUpdatedPassword
    );
    if (acknowledged) {
      return {
        data: null,
      };
    } else {
      return {
        error: new SuperError('Something went wrong', 500),
      };
    }
  }
};

export default changePasswordController;
