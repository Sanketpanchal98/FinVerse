import { Router } from "express";
import { UpdateEmail, UpdatePassword, UserInfo, UserLogOut, UserProfUpdate } from "../Controllers/User.controller.js";

const router = Router();

router.get('/info', UserInfo);

router.get('/logout', UserLogOut);

router.post('/update', UserProfUpdate);

router.post('/updatepass', UpdatePassword)

router.post('/updatemail', UpdateEmail)


export default router;