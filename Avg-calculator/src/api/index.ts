import { Router } from 'express'
import healthCheckRoute from './healthcheck'
import avgRouter from './Average/router'

export default (): Router => {
    const app = Router()
    app.use('/health', healthCheckRoute)
    app.use('/', avgRouter)
    return app
}
