import { Router } from 'express';
import { productosDao } from '../daos/productos/index.js'
import {usuarioActivo} from '../server.js'
//const moment = require('moment'); 
import moment from 'moment'

const productosRouter = Router()

productosRouter.get('/', async (req, res) => {
    const productos = await productosDao.listarAll()
    return res.render('productos', {usuarioActivo, productos})
    //res.json(productos)
})

productosRouter.get('/:id', async (req, res) => {
    const productos = await productosDao.listar(req.params.id);
    res.json(productos)
})

productosRouter.post('/', async (req, res) => {
    let fecha = moment().format("DD/MM/YYYY HH:mm:ss");
    req.body.timestamp = fecha
    const prodAgregado = await productosDao.guardar(req.body);
    res.json(prodAgregado)
})

productosRouter.put('/:id', async (req, res) => {
    const prodActualizado = await productosDao.actualizar(req.params.id,req.body);
    res.json(prodActualizado)
})

productosRouter.delete('/:id', async (req, res) => {
    const prodEliminado = await productosDao.borrar(req.params.id);
    res.json(prodEliminado)
})

productosRouter.delete('/', async (req, res) => {
    const prodEliminado = await productosDao.borrarAll();
    res.json(prodEliminado)
})
export { productosRouter }