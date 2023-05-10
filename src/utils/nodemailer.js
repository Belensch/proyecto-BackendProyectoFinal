import { createTransport } from 'nodemailer';
import { passMailAdmin, userMailAdmin } from '../config/config.js';
import { logger } from './logger.js';


const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: userMailAdmin,
        pass: passMailAdmin
    }
});

export const sendMailNewUser = async (newUser) => {

    const mailOptions = {
        from: 'Servidor Node.js',
        to: userMailAdmin,
        subject: 'Nuevo Usuario',
        html:
            `<h1 style="color: blue;">Nuevo usuario registrado</h1>'
        <div>
            <ul>
                <li>NOMBRE: <span style="color: green;"> ${newUser.name}</span></li>
                <li>DIRECCION <span style="color: green;">${newUser.address}</span></li>
                <li>EDAD <span style="color: green;">${newUser.age}</span></li>
                <li>TELEFONO <span style="color: green;">${newUser.phone}</span></li>
                <li>EMAIL <span style="color: green;">${newUser.email}</span></li>
                <li>imagen <img src="uploads/${newUser.photo}" width="16" height="16"/></li>
            </ul>
        </div>`

        
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        logger.info('mail enviado', info)
    } catch (err) {
        logger.error(err)
    }

}


export const sendMailNewCart = async (nombre, email, cart) => {

    let listaProductosCarrito = '<h3>Mi Carrito</h3>'
    cart.productos.forEach(element => {
        listaProductosCarrito += `<li>${element.title}   $${element.price} x ${element.cantidad}</li>`
    });

    const mailOptions = {
        from: 'Servidor Node.js',
        to: userMailAdmin,
        subject: 'Nuevo pedido de ' + nombre,
        html: `<h1 style="color: blue;">Nueva compra del usuario: <span style="color: green;"> ${email} </span></h1><div><ul>`
            + listaProductosCarrito + `<h2>Total $ ${cart.total} </h2></ul><div>`

    }

    try {
        const info = await transporter.sendMail(mailOptions)
        logger.info('mail enviado', info)
    } catch (err) {
        logger.error(err)
    }

}



