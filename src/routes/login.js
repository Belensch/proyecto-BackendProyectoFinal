import { Router } from 'express';
import { getLoginController, postLoginController } from '../controller/login.Controllers.js';
import { authenticate } from '../middleware/passport.js';



export const login = Router();


login.get('/' ,  getLoginController)

login.post('/' , postLoginController, authenticate )

