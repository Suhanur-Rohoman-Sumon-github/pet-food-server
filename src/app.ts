import express, { Application, Request, Response } from 'express'

import cors from 'cors'
import router from './app/routes'

import notFoundRoute from './app/utils/notFoundRoute'
import handleGlobalError from './app/error/globalErrorHandler'

const app: Application = express()

// parser
app.use(express.json())

app.use(cors())

// Application routers
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
  res.send(`server  is building`)
})

// handle 404 route
app.use(notFoundRoute)
app.use(handleGlobalError)

export default app
