import { usuariosDao, productosDao } from "../daos/index.js"


export const getHomeController = async (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.session.passport.user);
        //verifica si es admin
        if (req.session.passport.user === '64593a400c9549504d3c30c3') {
            res.redirect('/admin/home')
        }
        const nombre = (await usuariosDao.listar(req.session.passport.user))[0].name
        global.productos = await productosDao.listarAll()
        res.render('pages/home', {
            nombre: nombre,
            productos: global.productos,
            active: 'home' //pestana activa de NAVBAR
        })
    } else {
        res.redirect('/login')

    }
}
