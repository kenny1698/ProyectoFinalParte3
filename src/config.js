import fs from 'fs'

export default {
    fileSystem: {
        path: './DB'
    },
    env:{
        // method:'json'
         method: 'mongodb'
        //method: 'firebase'
    },
    mongodb: {
        cnxStr: 'mongodb+srv://kenny1698:kenny1698@cluster0.g7tte.mongodb.net/ecommerce?retryWrites=true&w=majority',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            serverSelectionTimeoutMS: 5000,
        }
    },
    firebase: JSON.parse(fs.readFileSync('./DB/firestore/proyectofinal2-1ec6f-firebase-adminsdk-4gw27-a6901626e6.json')),
    TEST_MAIL: 'nova.rath6@ethereal.email',
    PASS_MAIL:'jVcN73tfuGBJ6RGkdf',
    accountSid: 'AC63708a239cf7757e4fed929f482fe0d7',
    authToken: 'c94e671ee75475dbd589009b2cde919b',

    modo: 'FORK'
   
}
