import { ObjectId } from '@fastify/mongodb';
import { DBcollectionNames } from '../../../constants/db.js';
import { dbConnect } from '../../../helpers/db/index.js';
import { Controller } from '../../../models/common.js';
import SuperError from '../../../models/errors/SuperError.js';
import User from '../../../models/db/user/index.js';
import { randomUUID } from 'crypto';
import { sendFirebaseMessage } from '../../../helpers/messaging/index.js';
import { ICarCall } from '../../../models/db/car/index.js';

const CLIENT_APP_URL = process.env.CLIENT_APP_URL;

export interface ICallUserPayload {
  message: string;
  userName: string;
  carId: string;
}

const callUserController: Controller = async (request, reply, fastify) => {
  try {
    const { message, userName, carId } = request.body as ICallUserPayload;

    const db = dbConnect(fastify, DBcollectionNames.Users);

    const match = await db.findOne({ userName });

    if (match === null) {
      return {
        error: new SuperError('User not found', 404),
      };
    }

    const user = User.from(match);

    const newCall: ICarCall = {
      timeStamp: new Date(),
      message,
      id: randomUUID(),
      lang: fastify.lang,
      isRead: false,
      chat: [],
    };

    const userWithAddedCall = user.pushCarCall(carId, newCall);

    const { modifiedCount } = await db.replaceOne(
      { userName },
      userWithAddedCall
    );

    if (modifiedCount > 0) {
      let sendMessage = '';
      if (userWithAddedCall.messagingToken.trim().length > 0) {
        sendMessage = await sendFirebaseMessage({
          notification: {
            title: 'New call',
            body: 'Someone called you at your car',
          },
          data: {
            link: `${CLIENT_APP_URL}/dashboard`,
          },
          token: user.messagingToken,
        });
      }
      return {
        data: {
          message: sendMessage,
          id: newCall.id,
        },
      };
    } else {
      return {
        data: new SuperError('Error on calling, please try again'),
      };
    }
  } catch (error) {
    console.log({ error });
    return {
      error: new SuperError('Error on calling', 500),
    };
  }
};

export default callUserController;
