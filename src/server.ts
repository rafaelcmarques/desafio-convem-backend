import fastify from 'fastify'
import cors from '@fastify/cors'
import { transactionsRoutes } from './routes/transactions'
import { env } from './env'
const app = fastify()

app.register(cors)
app.register(transactionsRoutes)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP Server is Running !`)
  })
