import { Router } from "express";
import { UserInfo, UserLogOut } from "../Controllers/User.controller.js";

const router = Router();

router.get('/info', UserInfo);

router.get('/logout', UserLogOut);


export default router;