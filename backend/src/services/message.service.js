import createHttpError from "http-errors";
import { MessageModel, ConversationModel } from "../models/index.js";

export const createMessage = async (data) => {
  let newMessage = await MessageModel.create(data);
  if (!newMessage) throw createHttpError.BadRequest("Error to create message");
  return newMessage;
};

export const populateMessage = async (id) => {
  let msg = await MessageModel.findById(id)
    .populate({
      path: "sender",
      select: "name picture",
      model: "UserModel",
    })
    .populate({
      path: "conversation",
      select: "name picture isGroup users",
      model: "",
      populate: {
        path: "users",
        select: "name email picture status",
        model: "UserModel",
      },
    });
  if (!msg) throw createHttpError.BadRequest("There is not message created");
  return msg;
};

export const updatedLatestMessage = async (convo_id, msg) => {
  const updatedConvo = await ConversationModel.findOneAndUpdate(convo_id, {
    latestMessage: msg, //id of messages
  });
  if (!updatedConvo)
    throw createHttpError.BadRequest("There is not update message to show");
  return updatedConvo;
};

export const getConvoMessages = async (convo_id) => {
  const messages = await MessageModel.find({ conversation: convo_id })
    .populate({
      path: "conversation",
      select: "name picture isGroup users",
      model: "",
      populate: {
        path: "users",
        select: "name email picture status",
        model: "UserModel",
      },
    })

  if (!messages) {
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  }
  return messages;
};
