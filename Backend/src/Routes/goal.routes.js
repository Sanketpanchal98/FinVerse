import { Router } from "express";
import { addGoal, deleteGoal, getAllGoal, updateGoalProgress } from "../Controllers/Goal.controller.js";

const router = Router();

router.post('/create', addGoal)

router.put('/update', updateGoalProgress)

router.delete('/delete/:goalId', deleteGoal)

router.get('/getall', getAllGoal)

export default router