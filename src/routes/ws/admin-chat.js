import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as Socket } from 'socket.io';
import { mensajesDao } from '../../daos/index.js';
import { logger } from '../../utils/logger.js';

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);
logger.info('Socket.io ADMIN-CHAT configurado');

export default async function configurarSocket(socket) {
  // ---- CHAT ----
  socket.on('usersChatsHistory', async () => {
    try {
      const usersChats = await mensajesDao.listarAll();
      socket.emit('updateChatHistory', usersChats);
    } catch (error) {
      logger.info(error);
    }
  });

  socket.on('newMessageAdmin', async (data) => {
    try {
      const chat = await getChat(data.userEmail);
      chat.messages.push(data.message);
      await mensajesDao.actualizar(chat.id, { messages: chat.messages });

      const usersChats = await mensajesDao.listarAll();
      socket.emit('updateChatHistory', usersChats);
    } catch (error) {
      logger.info(error);
    }
  });
}

async function getChat(userEmail) {
  try {
    const messagesDB = await mensajesDao.listarAll();
    const chat = messagesDB.find((chat) => chat.email == userEmail);
    return chat;
  } catch (error) {
    logger.info(error);
  }
}
