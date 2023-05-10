import { usuariosDao } from "../daos/index.js"
import { createHash } from "../utils/crypt.js"
import { sendMailNewUser } from "../utils/nodemailer.js"
import { sendWhatsAppNewUser, sendSMSToUser } from "../utils/twilio.js"



export const postRegisterController = async (req, res) => {
    const usuarios = await usuariosDao.listarAll()
    const email = req.body.email
    const password = createHash(req.body.password)
    if (usuarios.find(usuario => usuario.email == email)) {
        req.session.message = "El e-mail ya se encuentra registrado, ingrese uno diferente"
        req.session.route = 'register'
        req.session.fileName = req.body.fileName
        res.redirect('/error')

    } else {
        const newUser = {
            name: req.body.nombre,
            address: req.body.direccion,
            age: req.body.edad,
            email: email,
            password: password,
            photo: req.body.fileName,
            phone: '+1' + req.body.telefono
        }
        await usuariosDao.guardar(newUser).then(res => {
            sendMailNewUser(newUser)
            // sendWhatsAppNewUser(newUser)
            sendSMSToUser(newUser)
        })
        res.redirect('/login')
    }
}

export const getRegisterController = (req, res) => {
    res.render('pages/register')
}






