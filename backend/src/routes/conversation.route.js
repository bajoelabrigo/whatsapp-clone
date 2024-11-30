import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import trimRequest from "trim-request";
import { create_open_conversation, createGroup, getConversations } from "../controllers/conversation.controller.js";

const router = express.Router();

router.route("/").post(trimRequest.all, authMiddleware, create_open_conversation);
router.route("/").get(trimRequest.all, authMiddleware, getConversations);
router.route("/group").post(trimRequest.all, authMiddleware, createGroup);

export default router;