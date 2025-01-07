import { FastifyInstance } from "fastify";
import { DBcollectionNames } from "../../constants/db.js";

export const dbConnect = (fastifyInstance: FastifyInstance, collectionName = DBcollectionNames.Users) => {
  const enviroment = process.env.DB_ENV;  
  return fastifyInstance.mongo.client.db(enviroment).collection(collectionName);
}