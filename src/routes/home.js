import { Router } from 'express'
import { getHomeController } from '../controller/home.Controllers.js'

export const home = Router()
home.get('/' , getHomeController)
