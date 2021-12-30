import mongoose from 'mongoose'
import config from '../config.js'

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

class ContenedorMongoDb {

    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async listar(id) {
        const objs = await this.listarAll()
        const buscado = objs.find(o => o.id == id)
        return buscado
    }

    async listarAll() {
        try {
            let elem = await this.coleccion.find({}, { _id: 0, __v: 0 })
            return elem
        } catch (error) {
            return []
        }
    }

    async guardar(obj) {
        const objs = await this.listarAll()
        let newId
        if (objs.length == 0) {
            newId = 1
        } else {
            newId = objs[ objs.length - 1 ].id + 1
        }
        const elemNuevo = new this.coleccion({ ...obj, id: newId }, {__v: 0 })
        await elemNuevo.save()

        try {
            return elemNuevo
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async actualizar(idelem, elem) {
        const objs = await this.listarAll()
        const index = objs.findIndex(o => o.id == idelem)
        if (index == -1) {
            throw new Error(`Error al actualizar: no se encontró el id ${idelem}`)
        } else {
            try {
                await this.coleccion.updateOne({ id: idelem }, elem)
            } catch (error) {
                throw new Error(`Error al actualizar: ${error}`)
            }
        }
    }

    async borrar(id) {
        const objs = await this.listarAll()
        const index = objs.findIndex(o => o.id == id)
        if (index == -1) {
            throw new Error(`Error al borrar: no se encontró el id ${id}`)
        }
        try {
            const deleted = await this.coleccion.deleteOne({ id: id })
            return deleted
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
        
    }

    async borrarAll() {
        try {
            let rsp = await this.coleccion.deleteMany({})
            return rsp
        } catch (error) {
            throw new Error(`Error al borrar todo: ${error}`)
        }

    }
}

export default ContenedorMongoDb