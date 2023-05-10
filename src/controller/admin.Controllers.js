import { productosDao, usuariosDao } from '../daos/index.js';
import { logger } from '../utils/logger.js';

export const getAdminHome = async (req, res) => {
  if (req.isAuthenticated()) {
    res.render('admin/home', {
      user: req.session.passport?.user,
    });
  } else {
    res.redirect('/login');
  }
};

export const getUpdate = async (req, res) => {
  if (!req.session.passport?.user) {
    res.render('pages/login.ejs');
  } else {
    const id = req.params.id;
    const product = await productosDao.listar(id);
    res.render('admin/update.ejs', {
      product: product[0],
      user: req.session.passport?.user,
    });
  }
};

export const postUpdate = async (req, res) => {
  const { product, category, price, description, thumbnail } = req.body;
  const id = req.params.id;

  if (!req.session.passport?.user) {
    res.render('pages/login.ejs');
  } else {
    const updatedProduct = {
      product: product,
      category: category,
      price: price,
      description: description,
      thumbnail: thumbnail,
    };

    await productosDao.actualizar(id, updatedProduct);
    logger.info('Producto actualizado');
    res.redirect('/admin/home');
  }
};

export const getAddProduct = async (req, res) => {
  if (!req.session.passport?.user) {
    res.render('pages/login.ejs');
  } else {
    res.render('admin/addProduct.ejs', { user: req.session.passport?.user });
  }
};

export const postAddProduct = async (req, res) => {
  const { title, stock, price, description, thumbnail } = req.body;

  if (!req.session.passport?.user) {
    res.render('pages/login.ejs');
  } else {
    const newProduct = {
      title,
      stock,
      price,
      description,
      thumbnail,
    };

    await productosDao.guardar(newProduct);
    logger.info('Producto agregado');

    res.redirect('/admin/home');
  }
};

export const getAdminChat = async (req, res) => {
  if (!req.session.passport?.user) {
    res.render('pages/login.ejs');
  } else {
    //busca al usuario en la Base de Datos
    const user = await usuariosDao.listar(req.session.passport?.user);
    res.render('admin/chat.ejs', { user: user[0] });
  }
};

export const getProfile = async (req, res) => {
  if (!req.session.passport?.user) {
    res.render('pages/login.ejs');
  } else {
    //Buscamos la informacion del usuario que enviaremos a la vista
    const user = await usuariosDao.listar(req.session.passport.user);
    //lo guardamos en una variable
    const userData = {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
      age: user[0].age,
      address: user[0].address,
      phone: user[0].phone,
      avatar: user[0].photo,
    };
    logger.info(userData);
    res.render('admin/profile.ejs', {
      user: userData,
    });
  }
};
