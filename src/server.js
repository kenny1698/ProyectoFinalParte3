/*
artillery quick --count 50 -n 20 http://localhost:8080/api/productos > result_cluster.txt
artillery quick --count 50 -n 20 http://localhost:8080/api/productos > result_fork.txt

*/
import express from 'express'
import { productosRouter } from './routers/productosRouter.js'
import { carritosRouter } from './routers/carritosRouter.js'

import { engine  } from 'express-handlebars'
import Handlebars from 'handlebars'
import passport  from'passport'
import passportLocal from 'passport-local'
import logger from './log4js/log4js-module.js'
import flash from 'connect-flash'
import User from './models/User.js'
import {allowInsecurePrototypeAccess} from '@handlebars/allow-prototype-access'

import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import session from 'express-session'
import multer from 'multer'
const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
      cb(null,'./src/images/')
  },
  filename: (req,file,cb)=>{
      //cb(null,file.fieldname + '-' + Date.now())
      cb(null,file.originalname)
  }
});

const upload = multer({storage})
let usuario = ''
let usuarioActivo = {}

import {
  createHash,
  isValidPassword
} from './utils.js'

import config from './config.js'
import { createTransport } from 'nodemailer'

const transporter = createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: config.TEST_MAIL,
      pass: config.PASS_MAIL
  }
})

// const mailOptions = {
//   from: 'Servidor Node.js',
//   to: config.TEST_MAIL,
//   subject: 'Nuevo Registro',
//   html: JSON.stringify(usuarioActivo)
// }



const LocalStrategy = passportLocal.Strategy;
const secretmongo = 'shhhhhhhhhhhhhhhhhhhhh'

const app = express()

app.use(session({ secret: secretmongo , 
    resave: false, 
    saveUninitialized:false, 
    cookie: { maxAge: 600000 }}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// app.engine('handlebars', engine());
// app.set('view engine', 'handlebars');
// app.set('views', './public/views');

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/public/views/layouts",
        partialsDir: __dirname + "/public/views/partials",
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    })
)

app.set('view engine', 'hbs')
app.set('views', './src/public/views')

app.use(express.static('src/images'));

app.use('/api/productos', productosRouter)
app.use('/api/carritos', carritosRouter)

passport.use('login', new LocalStrategy({
    usernameField: 'email',   
      passwordField: 'password'
  },
    (username, password, done) => {
      return User.findOne({ email:username })
        .then(user => {
          usuarioActivo = user
          usuario = user.username
          if (!user) {           
            return done(null, false, { message: 'Usuario de usuario incorrecto' })
          }
  
          if (!isValidPassword(user.password, password)) {
            return done(null, false, { message: 'Contraseña incorrecta' })
          }
  
          return done(null, user)
        })
        .catch(err => {
          return done(err)
        })
    }
  ))
  
  passport.serializeUser((user, done) => {
    done(null, user)
  })
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
  
  // passport.use('register', new LocalStrategy({
  //   passReqToCallback: true
  // }, upload.single('avatar'), (req, username, password, avatar, done) => {
  //   return User.findOne({ username })
  //     .then(user => {
  //       if (user) {
  //         return done(null, false, { message: 'El usuario de usuario ya existe' })
  //       }
  //       const file = req.file
  //       console.log(file)
  
  //       let newUser = new User()
  //       newUser.password = createHash(password)
  //       newUser.username = req.body.username
  //       newUser.email = req.body.email
  //       newUser.direccion = req.body.direccion
  //       newUser.edad = req.body.edad
  //       newUser.telefono = req.body.telefono
  //       newUser.avatar = req.body.avatar
  //       return newUser.save()

       
  //     })
  //     .then(user => {
  //       return done(null, user)
  //     })
  //     .catch(err => {
  //       return done(err)
  //     })
  // }))

  
  app.get('/login', (req, res) => {
    //return res.render('login', { message: req.flash('error') })
    return res.render('login')
  })

  app.get('/faillogin', (req, res) => {
    return res.render('faillogin', { message: req.flash('error') })
  })

  app.get('/failregister', (req, res) => {
    return res.render('failregister', { message: req.flash('error') })
  })
  
  app.post('/login', 
    passport.authenticate('login', { successRedirect: '/home',
                                     failureRedirect: '/faillogin',
                                     failureFlash: true }))
  
  app.get('/register', (req, res) => {
    return res.render('register')
  })

  app.get('/home', (req, res) => {
    return res.render('home')
  })
  
  
  app.post('/register',upload.single('avatar'), (req, res) => {
        usuario = req.body.username
        User.findOne({ email : req.body.email })
        .then(user => {
          usuarioActivo = user
          if (user) {
            return res.render('failregister', { message: 'El usuario de usuario ya existe' })
          }
          let newUser = new User()
          newUser.password = createHash(req.body.password)
          newUser.username = req.body.username
          newUser.email = req.body.email
          newUser.direccion = req.body.direccion
          newUser.edad = req.body.edad
          newUser.telefono = req.body.telefono
          newUser.avatar = req.file.originalname
          newUser.save()
          usuarioActivo = newUser
          try {
            const info =  transporter.sendMail({
              from: 'Servidor Node.js',
              to: config.TEST_MAIL,
              subject: 'Nuevo Registro',
              html: JSON.stringify(usuarioActivo)
            })
          } catch (error) {
            logger.error(err)
          }
         

          // const info = async () => {
          //   try {
          //     await transporter.sendMail(mailOptions)
          //   } catch (error) {
          //     throw new Error(error);
          //   }
          // }
          return res.render('home')
        })
  })

  app.get('/info', (req, res) => {
    return res.render('info', {usuario, usuarioActivo})
    //return res.render('register')
  })

  app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) //res.send('Logout ok!') 
        res.render('logout', {usuario}) 
        else res.send({ status: 'Logout ERROR', body: err })
    })   
})

  // app.post('/register',
  //   passport.authenticate('register', { successRedirect: '/',
  //                                    failureRedirect: '/failregister',
  //                                    failureFlash: true }))

                                       
  app.get('/', (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
})

export default app 

export {usuarioActivo}

