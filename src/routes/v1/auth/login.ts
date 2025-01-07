import { dbConnect } from '../../../helpers/db/index.js';
import { Controller } from '../../../models/common.js';
import SuperError from '../../../models/errors/SuperError.js';
import User from '../../../models/db/user/index.js';
import { ExpireTime, TokenTypes } from '../../../models/token/index.js';
import { setCookie } from '../../../helpers/cookie/index.js';

interface ILoginPayload {
  userName: string;
  password: string;
}

const loginController: Controller = async (request, reply, fastify) => {
  const { userName, password } = request.body as ILoginPayload;

  const db = dbConnect(fastify);

  const userDB = await db.findOne({ userName });

  if (!userDB) {
    return {
      error: new SuperError('User not found', 404),
    };
  }
  const user = User.from(userDB);

  const passwordIsCorrect = await user.checkPassword(password);

  if (passwordIsCorrect) {
    const userWithNewAccessToken = user.generateNewAccessToken();

    const updated = await db.replaceOne(
      { userName },
      userWithNewAccessToken,
    );

    if (updated.modifiedCount === 0) {
      return {
        error: new SuperError('Error on login', 500),
      };
    } else {
      setCookie(
        reply,
        TokenTypes.Access,
        userWithNewAccessToken.accessToken,
        ExpireTime.Week,
        true
      );

      return {
        data: 'Login success',
        status: 201,
      };
    }
  } else {
    return {
      error: new SuperError('Password is incorrect', 401),
    };
  }
};

export default loginController;
