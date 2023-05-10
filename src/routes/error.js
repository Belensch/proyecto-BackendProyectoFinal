import { Router } from 'express'
import { getErrorController } from '../controller/error.Controllers.js'

export const error = Router()

error.get('/' , getErrorController)