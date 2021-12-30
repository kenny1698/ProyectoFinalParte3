import { Router } from 'express';
import { carritosDao } from '../daos/carritos/index.js'
import { productosDao } from '../daos/productos/index.js'
import config from '../config.js'
import {usuarioActivo} from '../server.js'
import { createTransport } from 'nodemailer'
import twilio from 'twilio'
import logger from '../log4js/log4js-module.js'

const client = twilio(config.accountSid, config.authToken)

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: config.TEST_MAIL,
        pass: config.PASS_MAIL
    }
  })

const carritosRouter = Router()

carritosRouter.get('/', async (req, res) => {
    const carritos = await carritosDao.listarAll()
    return res.render('carritos', {usuarioActivo, carritos})
    //res.json(carritos)
})

carritosRouter.get('/:id', async (req, res) => {
    const carritos = await carritosDao.listar(req.params.id);
    res.json(carritos)
})

carritosRouter.post('/', async (req, res) => {
    const carAgregado = await carritosDao.guardar(req.body);
    const productos = await productosDao.listar(req.body.producto);
    const mensajeHtml = JSON.stringify(productos)
    const mensaje = 'Nuevo Pedido '+ usuarioActivo.email+ " " +usuarioActivo.username+ " " +JSON.stringify(productos)
    try {
        const info =  transporter.sendMail({
          from: 'Servidor Node.js',
          to: config.TEST_MAIL,
          subject: 'Nuevo Pedido ' + usuarioActivo.username + " " + usuarioActivo.email,
          html: mensajeHtml
        })
      } catch (error) {
        logger.error(error)
      }
    try {
        const message = await client.messages.create({
            body: mensaje,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${usuarioActivo.telefono}`
        })
        } catch (error) {
            logger.error(error)
        }

    const from = '+12172900665' 
    const to =  usuarioActivo.telefono.replace("+549", "+54");
    const body = 'Su pedido ha sido recibido y se encuentra en proceso'
    const sms = await client.messages.create({ body , from, to })

    res.json(carAgregado)
})

carritosRouter.put('/:id', async (req, res) => {
    const carActualizado = await carritosDao.actualizar(req.body);
    res.json(carActualizado)
})

carritosRouter.delete('/:id', async (req, res) => {
    const carEliminado = await carritosDao.borrar(req.params.id);
    res.json(carEliminado)
})

export { carritosRouter }