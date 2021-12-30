import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('productos', {
            timestamp: { type: String, required: true },
            nombre: { type: String, required: true },
            descripcion: { type: String, required: true },
            codigo: { type: Number, required: true },
            url: { type: String, required: true },
            precio: { type: Number, required: true },
            stock: { type: Number, required: true },
            id:{type: Number, required: true}
        })
    }
}

export default ProductosDaoMongoDb
