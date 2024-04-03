import { Router } from 'express'
import { calculate } from './controllers/get.service'

const avgRouter = Router()

avgRouter.get('/:numberID', calculate)

export default avgRouter
