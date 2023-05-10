import { Router } from 'express';
import { productosDao } from '../daos/index.js';

export const apiProducts = Router();

apiProducts.get('/', async (req, res) => {
  if (!req.session.passport?.user) {
    res.render('pages/login.ejs');
  } else {
    const products = await productosDao.listarAll();
    res.send(products);
  }
});

apiProducts.get('/:id', async (req, res) => {
  if (!req.session.passport?.user) {
    res.render('pages/login.ejs');
  } else {
    const id = req.params.id;
    const product = await productosDao.listar(id);
    res.send(product);
  }
});

apiProducts.post('/', async (req, res) => {
  if (!req.session.passport?.user) {
    res.render('pages/login.ejs');
  } else {
    const product = req.body;
    const savedProduct = await productosDao.guardar(product);
    res.send(savedProduct);
  }
});

apiProducts.put('/:id', async (req, res) => {
  if (!req.session.passport?.user) {
    res.render('pages/login.ejs');
  } else {
    const idProductUpdate = req.params.id;
    const productUpdate = req.body;
    const updatedProduct = await productosDao.actualizar(
      idProductUpdate,
      productUpdate
    );
    res.send(updatedProduct);
  }
});

apiProducts.delete('/:id', async (req, res) => {
  if (!req.session.passport?.user) {
    res.render('pages/login.ejs');
  } else {
    const id = req.params.id;
    await productosDao.borrar(id);
    res.send({ message: 'El Producto se elimino correctamente' });
  }
});
