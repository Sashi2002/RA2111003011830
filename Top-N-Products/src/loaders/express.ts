import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import config from '../config'
import routes from '../api'
import { Request, Response, NextFunction } from 'express'
import Logger from './logger'

export default ({ app }: { app: express.Application }): Express.Application => {
    app.enable('trust proxy')
    app.use(helmet())
    app.use(cors())
    app.use(express.json({ limit: '2mb' }))
    app.use(config.api.prefix, routes())

    app.use((err, req: Request, res: Response, next: NextFunction) => {
        Logger.error(err)
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || '🔌 Unknown Server Error Occurred 🔌',
            display: err.display || 'Null',
        })
    })
    return app
}
