import { ObjectId } from '@fastify/mongodb';

import { dbConnect } from '../../../helpers/db/index.js';
import { Controller } from '../../../models/common.js';
import SuperError from '../../../models/errors/SuperError.js';
import { sendFirebaseMessage } from '../../../helpers/messaging/index.js';

interface ISaveMessagingTokenPayload {
  token: string;
}

const saveMessagingTokenController: Controller = async (
  request,
  _reply,
  fastify
) => {
  try {
    const { token } = request.body as ISaveMessagingTokenPayload;
    const decodedTonen = fastify.decodedTonen;

    const user = fastify.userDB;

    if (user.messagingToken && user.messagingToken.trim().length > 0) {
      try {
        const messageId = await sendFirebaseMessage({
          notification: {
            title: 'New login from another device',
          },
          token: user.messagingToken,
        });
      } catch (errorSendMessage) {
        console.log({ errorSendMessage }); 
      }
    }

    const userWithUpdatedMessagingToken = user.setMessagingToken(token);

    const { modifiedCount } = await dbConnect(fastify).replaceOne(
      { _id: new ObjectId(decodedTonen.userId) },
      userWithUpdatedMessagingToken
    );

    if (modifiedCount === 0) {
      return {
        error: new SuperError('Error on saving token', 500),
      };
    } else {
      return {
        data: null,
      };
    }
  } catch (error) {
    console.log({ error });

    return {
      error: new SuperError('Error on calling', 500),
    };
  }
};

export default saveMessagingTokenController;
