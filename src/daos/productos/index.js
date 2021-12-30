import config from '../../config.js'

let productosDao

switch (config.env.method) {
    case 'json':
        const { default: ProductosDaoArchivo } = await import('./ProductosDaoArchivo.js')
        productosDao = new ProductosDaoArchivo(config.fileSystem.path)
        break
    case 'firebase':
        const { default: ProductosDaoFirebase } = await import('./ProductosDaoFirebase.js')
        productosDao = new ProductosDaoFirebase()
        break
    case 'mongodb':
        const { default: ProductosDaoMongoDb } = await import('./ProductosDaoMongoDb.js')
        productosDao = new ProductosDaoMongoDb()
        break
    default:
        const { default: ProductosDaoMem } = await import('./ProductosDaoMem.js')
        productosDao = new ProductosDaoMem()
        break
}

export { productosDao }