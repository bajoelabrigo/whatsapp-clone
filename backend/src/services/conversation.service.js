import { ConversationModel, UserModel } from "../models/index.js";
import createHttpError from "http-errors";

export const doesConversationExist = async (sender_id, receiver_id) => {
  let convos = await ConversationModel.find({
    isGroup: false,
    $and: [
      //check if the sender or receiver is in the conversation
      { users: { $elemMatch: { $eq: sender_id } } },
      { users: { $elemMatch: { $eq: receiver_id } } },
    ],
  })
    //if exist populate the conversation with all information unless password
    .populate("users", "-password")
    .populate("latestMessage");

  if (!convos)
    throw createHttpError.BadRequest("Oops...Something went wrong !");

  //populate message model
  convos = await UserModel.populate(convos, {
    path: "latestMessage_sender",
    select: "name email picture status",
  });

  return convos[0];
};

export const createConversation = async (data) => {
  const newConvo = await ConversationModel.create(data);
  if (!newConvo)
    throw createHttpError.BadRequest(
      "There are problems creating a conversation !"
    );
  return newConvo;
};

export const populatedConversation = async (
  id,
  fieldToPopulate,
  fieldToRemove
) => {
  const populatedConvo = await ConversationModel.findOne({ _id: id }).populate(
    fieldToPopulate,
    fieldToRemove
  );
  if (!populatedConvo)
    throw createHttpError.BadRequest(
      "There are problems populating the conversation !"
    );
  return populatedConvo;
};

export const getUserConversations = async (user_id) => {
  let conversations;
  await ConversationModel.find({
    users: { $elemMatch: { $eq: user_id } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await UserModel.populate(results, {
        path: "latestMessage_sender",
        select: "name email picture status",
      });
      conversations = results;
    })
    .catch((err) => {
      throw createHttpError.BadRequest(
        "There are problems populating the conversation !"
      );
    });

  return conversations;
};
