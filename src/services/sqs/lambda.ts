import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

const dynamoDB = new DynamoDBClient({ region: 'us-east-2' })

export const handler = async (event) => {
  try {
    console.log('event: ', event)

    const { Records } = event

    if (!Records || Records.length === 0) {
      console.error('No records found in the event.')
      return { statusCode: 400, message: 'No records found in the event' }
    }

    const body = JSON.parse(Records[0].body)

    const command = new PutItemCommand({
      TableName: 'desafio-convem-table',
      Item: {
        idempotencyId: { S: body.idempotencyId },
        amount: { N: Number(body.amount).toString() },
        type: { S: body.type },
      },
    })

    await dynamoDB.send(command)

    return { statusCode: 200, message: 'Data stored successfully' }
  } catch (error) {
    console.error('Error in executing lambda: ', error)
    return { statusCode: 500, message: 'Error while execution' }
  }
}
