
import { carritosDao, usuariosDao } from "../daos/index.js"
import { sendMailNewCart } from "../utils/nodemailer.js"
import { sendMessageNewCart } from "../utils/twilio.js"


let carritos = []  // carritos generados por los usuarios

export const getCartController = async (req, res) => {
    if (req.isAuthenticated()) {
        const nombre = (await usuariosDao.listar(req.session.passport.user))[0].name // Se identifica el nombre del usuario con el id
        console.log(req.session.passport.user);
        let miCarrito = carritos.find(carrito => carrito.user === req.session.passport.user) //Se identifica el carrito del usuario

        res.render('pages/cart', {
            nombre: nombre,
            carrito: miCarrito,
            active: 'cart'
        })
    } else {
        res.redirect('/login')
    }
}


export const postCartAddProductController = (req, res) => {
    if (req.isAuthenticated()) {

        const price = global.productos.find(producto => producto.id === req.body.producto.id).price //busca el precio con el id enviado desde el home
        const title = global.productos.find(producto => producto.id === req.body.producto.id).title //lo busca con el titulo
        let miCarrito = carritos.find(carrito => carrito.user === req.session.passport.user) // verifica si el usuario ya tiene un carrito
        if (!miCarrito) {  //si no tiene carrito creamos uso y le damos su formato
            miCarrito = {}
            miCarrito.user = req.session.passport.user
            miCarrito.productos = []
            miCarrito.total = 0
        }

        miCarrito.total += Number(req.body.producto.cantidad) * price // actualiza el total del carrito con la cantidad dada en el home
        miCarrito.productos.push({ ...req.body.producto, title: title, price: price }) //agrega el producto al carrito 

        const index = carritos.findIndex(carrito => carrito.user === req.session.passport.user) // identificamos la posicion en la que se encuentra
        if (index == -1) {
            carritos.push(miCarrito) //si no existe se agrega
        } else {
            carritos[index] = miCarrito //Si ya existia, se sobrescribe lo agregado
        }

    } else {
        res.redirect('/login')
    }
}

export const deleteCartProductController = async (req, res) => { // por params mando el id del producto que deseo eliminar
    if (req.isAuthenticated()) {

        let miCarrito = carritos.find(carrito => carrito.user === req.session.passport.user)
        let index = miCarrito.productos.findIndex(producto => producto.id === req.params.id) // indice del producto a eliminar

        miCarrito.total -= miCarrito.productos[index].price * miCarrito.productos[index].cantidad // resto el precio del producto a eliminar
        miCarrito.productos.splice(index, 1)            // Elimino el producto del array miCarrito.productos
        index = carritos.findIndex(carrito => carrito.user === req.session.passport.user)  // indice de miCarrito
        carritos[index] = miCarrito             // Actualizo carritos

        res.redirect('/cart')
    } else {
        res.redirect('/login')
    }
}

export const postCartBuyController = async (req, res) => {
    if (req.isAuthenticated()) {

        const usuario = await usuariosDao.listar(req.session.passport.user) // buscamos el usuario y lo guardamos en una constante 
        let miCarrito = carritos.find(carrito => carrito.user === req.session.passport.user) // Identidico el carrito del usuario

        await carritosDao.guardar(miCarrito) // Guardamos el carrito del usuario en MONGO

        sendMailNewCart(usuario[0].name, usuario[0].email, miCarrito)       // Envio mail al admin con la nueva compra
        sendMessageNewCart(usuario[0].name, usuario[0].email, miCarrito)    // Envio whatsapp al admin con la nuevq compra

        const index = carritos.findIndex(carrito => carrito.user === req.session.passport.user) // Indice de miCarrito
        carritos.splice(index, 1)    // Elimino el carrito completo porque ya se realizo la compra

        res.redirect('/cart')

    } else {
        res.redirect('/login')
    }
}
