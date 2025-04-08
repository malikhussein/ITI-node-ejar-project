import { Router } from 'express';
import Chat from '../controllers/chat.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const chatRouter = Router();

chatRouter.post('/', authMiddleware, Chat.createChat);
chatRouter.get('/', authMiddleware, Chat.getUserChats);
chatRouter.get('/:chatId', authMiddleware, Chat.getChatById);

export default chatRouter;
