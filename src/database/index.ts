import { credentials } from '../services/credentials'
import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

interface Item {
  id: string
  amount: string
  type: string
}

const dbClient = new DynamoDB(credentials)

const docClient = DynamoDBDocumentClient.from(dbClient)

export const fetchAllData = async (tableName: string) => {
  const scanParams = {
    TableName: tableName,
  }

  try {
    const data = (await docClient.send(new ScanCommand(scanParams))) as {
      Items: Item[] | undefined
    }
    if (data.Items) {
      const transformedData = formatData(data.Items)
      return transformedData
    }
    return []
  } catch (error) {
    console.error('Unable to scan table:', error)
  }
}

function formatData(items: Item[]) {
  return items.map((item) => {
    const transformedItem: Item = {} as Item
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const value = item[key as keyof Item]
        if (typeof value === 'object' && value !== null) {
          transformedItem[key as keyof Item] = value[Object.keys(value)[0]]
        } else {
          transformedItem[key as keyof Item] = value
        }
      }
    }
    return transformedItem
  })
}
