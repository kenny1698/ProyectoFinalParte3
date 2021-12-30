import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"

class CarritosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('carritos', {
            timestamp: { type: String, required: true },
            producto: { type: Number, required: true }
        })
    }
}

export default CarritosDaoMongoDb
