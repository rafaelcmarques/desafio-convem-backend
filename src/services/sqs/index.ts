import { env } from '../../env'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { credentials } from '../credentials'

interface BodyProps {
  idempotencyId: string
  amount: number
  type: 'credit' | 'debit'
}

const sqsClient = new SQSClient(credentials)

const queuUrl = env.QUEU_URL

export const sendMessageToQueue = async (body: BodyProps) => {
  try {
    const command = new SendMessageCommand({
      MessageBody: JSON.stringify(body),
      QueueUrl: queuUrl,
      MessageAttributes: {
        OrderId: { DataType: 'String', StringValue: '4421x' },
      },
    })
    const result = await sqsClient.send(command)
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}
