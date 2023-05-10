import { usuariosDao } from '../daos/index.js';
import { logger } from '../utils/logger.js';

export const getProfile = async (req, res) => {
  if (req.isAuthenticated()) {
    //Buscamos la informacion del usuario que se  enviara a la vista
    const user = await usuariosDao.listar(req.session.passport.user);

    //se guarda en una variable
    const userData = {
        id: user[0].id,
        email: user[0].email,
        nombre: user[0].name,
        edad: user[0].age,
        direccion: user[0].address,
        telefono: user[0].phone,
        avatar: user[0].photo
    }
    logger.info(userData);
    //se envia a la vista
    res.render('pages/profile', {
        name: userData.nombre,
        email: userData.email,
        age: userData.edad,
        address: userData.direccion,
        phone: userData.telefono,
        avatar: userData.avatar,
      active: 'profile',
    });
  } else {
    res.redirect('/login');
  }
};
