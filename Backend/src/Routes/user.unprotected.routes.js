import { Router } from "express";
import { accessTokenRefresh, UserLogin, UserRegister } from "../Controllers/User.controller.js";

const router = Router()

router.post('/login' , UserLogin)

router.post('/register' , UserRegister)

router.post('/refresh-token', accessTokenRefresh);

export default router