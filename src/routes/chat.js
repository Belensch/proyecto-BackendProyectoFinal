import { Router } from 'express';
import { getChat } from '../controller/chat.Controllers.js';

export const chat = new Router();

chat.get('/', getChat);
