import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import { trpcRouter } from './trpc'

const expressApp = express()
expressApp.use(cors())

expressApp.get('/', (req, res) => {
  res.send('Hello, World!')
})

expressApp.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: trpcRouter,
    createContext: () => ({}),
  })
)

const PORT = process.env.PORT || 3000
expressApp.listen(PORT, () => {
  console.info(`Server is running on port http://localhost:${PORT}`)
})
