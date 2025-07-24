import { Router } from "express";
import { addAutopay, editAutopay, fetchAllAutopay, removeAutopay } from "../Controllers/Autopay.controller.js";

const router = Router();

router.post('/create', addAutopay);

router.get('/delete/:autopayId', removeAutopay);

router.post('/edit/:autopayId', editAutopay);

router.get('/all', fetchAllAutopay);

export default router;