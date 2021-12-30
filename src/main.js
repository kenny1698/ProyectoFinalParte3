import app from './server.js'
import logger from './log4js/log4js-module.js'
import config from './config.js'
import cluster  from 'cluster'
import os from 'os'
const numCPUs = os.cpus().length

const PORT =  process.env.PORT || 8080

const modoCluster = config.modo == 'CLUSTER'

if (modoCluster && cluster.isMaster) {
    logger.info(`PID MASTER ${process.pid}`)

  for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
  }

  cluster.on('exit', worker => {
      logger.info('Worker', worker.process.pid, 'died', new Date().toLocaleString())
      cluster.fork()
  })
} else {

const server = app.listen(PORT, () => {
    logger.info(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => logger.info(`Error en servidor ${error}`))

logger.info(`Worker ${process.pid} started`)
}
