import twilio from 'twilio'
import { twilioSID, twilioToken, twilioMessagingServiceSid, twilioWhatsAppPhoneNumber, adminWhatsAppPhoneNumber, adminPhoneNumber } from '../config/config.js'
import { logger } from './logger.js'

const client = twilio(twilioSID, twilioToken)


export const sendSMSToUser = async (newUser) => {

    const msg = `NUEVO USUARIO REGISTARDO
    name: ${newUser.name}
    DIRECCION: ${newUser.address}
    EDAD: ${newUser.age}
    TELEFONO: ${newUser.phone}
    EMAIL: ${newUser.email}`

    try {
        const message = await client.messages.create({
            body: msg,
            from: '+15077075906',
            to: adminPhoneNumber               
        })
        logger.info(`SMS cart send`, message)

    } catch (error) {
        logger.error(error)
    }
}


export const sendWhatsAppNewUser = async (newUser) => {

    const msg = `NUEVO USUARIO REGISTARDO
    name: ${newUser.name}
    DIRECCION: ${newUser.address}
    EDAD: ${newUser.age}
    TELEFONO: ${newUser.phone}
    EMAIL: ${newUser.email}`

    try {
        const message = await client.messages.create({
            body: msg,
            from: 'whatsapp:+15077075906',
            to: `whatsapp:${adminWhatsAppPhoneNumber}`
        })
        logger.info('whatsApp new user send', message)

    } catch (error) {
        logger.error('error AL ENVIAR', error)
    }
}

export const sendMessageNewCart = async (name, email, cart) => {  // funcion que envie whatsApp y SMS con nuevo carrito comprado

    let listaProductosCarrito = `NUEVO CARRITO de ${name} ( email: ${email} ) \n`
    cart.productos.forEach(element => {
        listaProductosCarrito += `${element.title}   $${element.price} x ${element.cantidad} \n`
    });

    const msg = listaProductosCarrito + 'Total: $' + cart.total


    //-----------------ENVIO DE WHATSAPP-------------------//
    try {
        const message = await client.messages.create({
            body: msg,
            from: 'whatsapp:+15077075906',
            to: `whatsapp:${adminWhatsAppPhoneNumber}`
        })
        logger.info('whatsApp new cart send', message)
    } catch (error) {
        logger.error('error AL ENVIAR WHATSAPP new cart', error)
    }
    //-----------------ENVIO DE SMS------------------------//
    try {
        const message = await client.messages.create({
            body: msg,
            from: '+15077075906',
            to: adminPhoneNumber
        })

        logger.info('SMS new cart send', message)

    } catch (error) {
        logger.error('ERROR AL ENVIAR SMS new cart', error)
    }
}


