import { sendFirebaseMessage } from '../../../helpers/messaging/index.js';
import { Controller } from '../../../models/common.js';
import SuperError from '../../../models/errors/SuperError.js';
// import { Message } from 'firebase-admin/messaging';
// import messaging from '../../../firebaseAdmin.js';

interface ISaveMessagingTokenPayload {
  token: string;
}

const sendMessageToClientController: Controller = async (request, _reply) => {
  try {
    const { title, body, token } = request.body as {
      title: string;
      body: string;
      token: string;
    };

    const messageId = await sendFirebaseMessage({
      notification: {
        title: title, 
        body: body,
      },
      token: token,
    });

    return {
      data: null,
    };
  } catch (error) {
    console.log({ error });
    return {
      error: new SuperError('Error on calling', 500),
    };
  }
};

export default sendMessageToClientController;
