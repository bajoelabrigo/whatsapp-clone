import createHttpError from "http-errors";
import logger from "../config/logger.config.js";
import { findUser } from "../services/user.service.js";
import {
  createConversation,
  doesConversationExist,
  getUserConversations,
  populatedConversation,
} from "../services/conversation.service.js";

export const create_open_conversation = async (req, res, next) => {
  console.log(req.body);
  try {
    const sender_id = req.user.userId; //sacar del token el user id
    const { receiver_id, isGroup } = req.body;

    //check if receiver_id is provided
    if (!receiver_id) {
        isGroup = false
      logger.error(
        "please provide the user id you wanna start a conversation with !"
      );
      throw createHttpError.BadGateway(
        "please provide the user id you wanna start a conversation with !"
      );
    }

    //check if conversation already exists
    const existed_conversation = await doesConversationExist(
      sender_id,
      receiver_id
    );
    if (existed_conversation) {
      res.json(existed_conversation);
    } else {
      let receiver_user = await findUser(receiver_id);
      let convoData = {
        name: receiver_user.name,
        picture: "conversation picture",
        isGroup: false,
        users: [sender_id, receiver_id],
      };
      const newConvo = await createConversation(convoData);
      const populated_convo = await populatedConversation(
        newConvo._id,
        "users",
        "-password"
      );
      res.status(200).json(populated_convo);
    }
  } catch (error) {
    next(error);
  }
};


export const getConversations = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const conversations = await getUserConversations(user_id)
        res.status(200).json(conversations)
    } catch (error) {
        next(error);
        
    }
};

export const createGroup = async (req, res, next) => {};
