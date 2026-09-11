import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { trpcRouter } from './trpc'
import cors from 'cors'

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
