import { z } from 'zod'
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { fetchAllData } from '../database'
import { sendMessageToQueue } from '../services/sqs/sender'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      amount: z.number().min(0.1),
      type: z.enum(['credit', 'debit']),
    })

    const idempotencyId = randomUUID()

    const { amount, type } = createTransactionBodySchema.parse(request.body)

    try {
      await sendMessageToQueue({ idempotencyId, amount, type })
      return reply.status(201).send({
        idempotencyId,
        type,
        amount,
      })
    } catch (error) {
      return reply.status(500).send({
        error,
      })
    }
  })

  app.get('/transactions', async (request, reply) => {
    try {
      const data = await fetchAllData('desafio-convem-table')

      return reply.status(200).send({
        data,
      })
    } catch (error) {
      return reply.status(500).send({
        error,
      })
    }
  })
}
