import { env } from '../env'

export const credentials = {
  region: env.REGION,
  credentials: {
    accessKeyId: env.ACCESS_ID_KEY,
    secretAccessKey: env.SECRET_ID_KEY,
  },
}
