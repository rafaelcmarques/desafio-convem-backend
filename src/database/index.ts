import { credentials } from '../services/credentials'
import { DynamoDB, ScanCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

interface Item {
  [key: string]: any
}

const dbClient = new DynamoDB(credentials)

const docClient = DynamoDBDocumentClient.from(dbClient)

export const fetchAllData = async (tableName: string) => {
  const scanParams = {
    TableName: tableName,
  }

  try {
    const data = await docClient.send(new ScanCommand(scanParams))
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
    const transformedItem: Record<string, any> = {}
    for (const key in item) {
      if (Object.hasOwnProperty.call(item, key)) {
        transformedItem[key] = item[key][Object.keys(item[key])[0]]
      }
    }
    return transformedItem
  })
}
