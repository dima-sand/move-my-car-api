import { ObjectId } from '@fastify/mongodb';
import { deleteCookie, setCookie } from '../../../helpers/cookie/index.js';
import { dbConnect } from '../../../helpers/db/index.js';
import { Controller } from '../../../models/common.js';
import { TokenTypes } from '../../../models/token/index.js';
import { DBcollectionNames } from '../../../constants/db.js';

const logoutController: Controller = async (request, reply, fastify) => {
  const decodedTonen = fastify.decodedTonen;

  const updated = await dbConnect(fastify).updateOne(
    { _id: new ObjectId(decodedTonen.userId) },
    {
      $set: {
        messagingToken: '',
        accessToken: '',
      },
    }
  );
  deleteCookie(reply, TokenTypes.Access);
  return {};
};

export default logoutController;
