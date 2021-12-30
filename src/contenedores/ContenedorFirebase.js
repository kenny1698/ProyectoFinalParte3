import admin from "firebase-admin"
import config from '../config.js'

admin.initializeApp({
    credential: admin.credential.cert(config.firebase)
})

const db = admin.firestore();

class ContenedorFirebase {

    constructor(nombreColeccion) {
        this.coleccion = db.collection(nombreColeccion)
    }

    async listar(id) {
        const objs = await this.listarAll()
        const buscado = objs.find(o => o.id == id)
        return buscado

    }

    async listarAll() {
        try {
            let elem = await this.coleccion.get()
            return elem.docs
        } catch (error) {
            return []
        }
    }

    async guardar(elem) {
        const objs = await this.listarAll()
        let newId
        if (objs.length == 0) {
            newId = 1
        } else {
            newId = objs[ objs.length - 1 ].id + 1
        }
        const elemNuevo =  await this.coleccion
            .doc("/" + newId + "/")
            .create(elem);
        try {
            return elemNuevo
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }

    }

    async actualizar(idelem, elem) {
        const objs = await this.listarAll()
        //console.log(objs)
        const index = objs.findIndex(o => o.id == idelem)
        const test = this.coleccion.doc(idelem).get()
        //console.log(test)
        if (index == -1) {
            throw new Error(`Error al actualizar: no se encontró el id ${idelem}`)
        } else {
            try {
                await this.coleccion.doc(idelem).update(elem)
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
             const deleted = await this.coleccion.doc(id).delete()
            return deleted
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async borrarAll() {
        // version fea e ineficiente pero entendible para empezar
        try {
            const docs = await this.listarAll()
            const ids = docs.map(d => d.id)
            const promesas = ids.map(id => this.borrar(id))
            const resultados = await Promise.allSettled(promesas)
            const errores = resultados.filter(r => r.status == 'rejected')
            if (errores.length > 0) {
                throw new Error('no se borró todo. volver a intentarlo')
            }
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async desconectar() {
    }
}



export default ContenedorFirebase