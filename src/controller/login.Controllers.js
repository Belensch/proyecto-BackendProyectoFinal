import { usuariosDao } from "../daos/index.js"
import { isValidPassword } from '../utils/crypt.js'
import { logger } from "../utils/logger.js"

export const postLoginController = async (req, res, next) => {
    const usuarios = await usuariosDao.listarAll() //Ubicamos a todos los usuarios 
    const user = usuarios.find(usuario => usuario.email === req.body.username) //buscamos al usuario que esta haciendo el login
    
    if (!user) {
        req.session.message = 'Usuario no encontrado'
    } else {
        if (!isValidPassword(req.body.password, user.password)) {
            req.session.message = 'Password incorrecto'
        }
    }

    //lo guardamos en una variable
    const userData = {
        id: user.id,
        email: user.email,
        nombre: user.name,
        edad: user.age,
        direccion: user.address,
        telefono: user.phone,
        foto: user.photo
    }

    req.session.route = 'login'
    req.session.passport = { user: userData }
    //verificamos si se guardo el usuario en la session
    // logger.info(req.session.passport)
    //seleccionamos el nombre del usuario
    next();
}

export const getLoginController = (req, res) => {
    res.render('pages/login')
}