import { Message } from "firebase-admin/messaging";
import messaging from "../../firebaseAdmin.js";

export const sendFirebaseMessage = async (message: Message) =>
  await messaging.send(message);