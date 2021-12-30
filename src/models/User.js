import mongoose from 'mongoose'
import config from '../config.js'

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

const User = mongoose.model ('User', {
    email: { type: String, required: true },
    username: { type: String, required: true },
    direccion: { type: String, required: true },
    edad: { type: Number, required: true },
    telefono: { type: String, required: true },
    avatar: { type: String, required: true },
    password: { type: String, required: true }
})

export default User 