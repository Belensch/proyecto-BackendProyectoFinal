import express from 'express';
import { Server as HttpServer } from 'http';
import moment from 'moment';
import { Server as Socket } from 'socket.io';

import { carritosDao, usuariosDao } from '../../daos/index.js';

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

export default async function configurarSocket(socket) {
  // ---- CARRITO ----
  // carga de productos
  socket.on('getItemsCart', async (userEmail) => {
    try {
      const cart = await getCart(userEmail);

      socket.emit('itemsCart', cart.items);
    } catch (error) {
      logger.info(error);
    }
  });

  // eliminar producto del carrito
  socket.on('deleteProduct', async (deleteProduct) => {
    try {
      const cart = await getCart(deleteProduct.userEmail);
      const newCartItems = cart.items.filter(
        (item) => item._id != deleteProduct.productID
      );

      await carritosDao.actualizar(cart._id, { items: newCartItems });
      socket.emit('itemsCart', newCartItems);
    } catch (error) {
      logger.info(error);
    }
  });

  // realizar compra
  socket.on('makePruchase', async (userEmail) => {
    try {
      const cart = await getCart(userEmail);
      const client = await getClient(userEmail);
      const ordersDB = await ordersApi.listarAll();

      const purchase = {
        numOfOrder: ordersDB.length + 1,
        email: userEmail,
        adress: client.adress,
        date: moment().format('DD/MM/YYYY, HH:mm:ss'),
        items: cart.items,
      };

      await ordersApi.save(purchase);
      sendNewPurchaseEmail(client, purchase);

      await carritosDao.actualizar(cart._id, { items: [] });
      socket.emit('purchaseMade');
    } catch (error) {
      logger.info(error);
    }
  });
}

async function getCart(userEmail) {
  try {
    const cartsDB = await carritosDao.listarAll();
    const cart = cartsDB.find((cart) => cart.email == userEmail);
    return cart;
  } catch (error) {
    logger.info(error);
  }
}

async function getClient(userEmail) {
  try {
    const usersDB = await usersApi.listarAll();
    const client = usersDB.filter((user) => user.email == userEmail);
    return client[0];
  } catch (error) {
    logger.info(error);
  }
}
