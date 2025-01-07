import { dbConnect } from '../../../helpers/db/index.js';
import { Controller } from '../../../models/common.js';
import { DBcollectionNames } from '../../../constants/db.js';
import SuperError from '../../../models/errors/SuperError.js';
import User from '../../../models/db/user/index.js';
import { encryptString } from '../../../helpers/crypto/index.js';
import TokenService from '../../../services/tokenService/index.js';
import { randomUUID } from 'crypto';
import { ObjectId } from '@fastify/mongodb';
import { setCookie } from '../../../helpers/cookie/index.js';
import { ExpireTime, TokenTypes } from '../../../models/token/index.js';
import { LocaleLang } from '../../../constants/locales/index.js';
import Car from '../../../models/db/car/index.js';

interface IRegisterPayload {
  userName: string;
  password: string;
  carNumber: string;
  carName: string;
}

const registrationController: Controller = async (request, reply, fastify) => {
  const { userName, password, carNumber, carName } =
    request.body as IRegisterPayload;

  const encryptedPassword = await encryptString(password);

  const db = dbConnect(fastify, DBcollectionNames.Users);

  const existedUser = await db.findOne({ userName });
  if (existedUser?._id) {
    return {
      error: new SuperError('Login is already exists', 200),
    };
  }

  const car = Car.create({
    index: 0,
    carNumber: carNumber ?? '',
    carName: carName ?? '',
    carCalls: [],
    carLocation: null,
    carPrefs: {
      autoMessage: '',
      isVisibleCarName: true,
      isVisibleCarNumber: true,
    },
  });

  const newUser = User.create({
    userName,
    password: encryptedPassword,
    cars: [car],
    prefs: {
      lang: fastify.lang ?? LocaleLang.En,
    },
  });

  const createdUser = await db.insertOne(newUser);

  if (createdUser.acknowledged) {
    const { accessToken } = TokenService.generateTokenPair({
      userId: createdUser.insertedId.toJSON(),
    });

    const tokenAddedToDB = await db.updateOne(
      { userName },
      {
        $set: {
          accessToken,
        },
      }
    );

    if (tokenAddedToDB.acknowledged) {
      setCookie(reply, TokenTypes.Access, accessToken, ExpireTime.Week, true);
      return {
        status: 201,
      };
    }
  }
  return {
    error: new SuperError('Error on register a new user'),
  };
};

export default registrationController;
