import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as Socket } from 'socket.io';

import { log } from 'console';
import { mensajesDao } from '../../daos/index.js';
import { logger } from '../../utils/logger.js';

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);
logger.info('Socket.io configurado');

export default async function configurarSocket(socket) {
  // ---- CHAT ----
  socket.on('chatHistory', async (userEmail) => {
    try {
      const chat = await getChat(userEmail);
      if (!chat) {
        const newChat = {
          email: userEmail,
          messages: [],
        };
        await mensajesDao.guardar(newChat);
        socket.emit('updateChat', newChat.messages);
      } else
      socket.emit('updateChat', chat.messages);
    } catch (error) {
      logger.info(error);
    }
  });

  socket.on("newMessage", async (message) => {
    try {
        const chat = await getChat(message.email);
        chat.messages.push(message);
        logger.info("este es el chat que sera actualizado", chat);
        await mensajesDao.actualizar(chat.id, { messages: chat.messages })

        socket.emit("updateChat", chat.messages);
    } catch (error) {
        logger.info(error);
    }
});

}

async function getChat(userEmail) {
  try {
    const messagesDB = await mensajesDao.listarAll();
    const chat = messagesDB.find((chat) => chat.email == userEmail);
    logger.info("Chat de la persona que envio mensaje", chat);
    return chat;
  } catch (error) {
    logger.info(error);
  }
}
