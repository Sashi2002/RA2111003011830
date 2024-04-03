import { NextFunction, Request, Response, Router } from 'express'
import os from 'os'

const healthCheckRoute = Router()
const timeElapsed = Date.now()
const today = new Date(timeElapsed)

healthCheckRoute.get('/', (req: Request, res: Response, next: NextFunction) => {
    try {
        const healthCheckData = {
            message: 'Afford Medical Test Server',
            timestamp: today.toUTCString(),
            architecture: os.arch(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            platform: os.platform(),
            osType: os.type(),
            osRelease: os.release(),
            osVersion: os.version(),
            hostname: os.hostname(),
            userInfo: os.userInfo(),
            reqIP: req.ip,
        }
        res.status(200).json({ status: true, message: healthCheckData })
        next()
    } catch (e) {
        res.status(503).json({
            success: false,
            message: '🚫 API Health Check Failed 🚫',
        })
    }
})

export default healthCheckRoute
