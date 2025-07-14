import {Router} from 'express'
import { addExpense, expenseList, expenseInfo } from '../Controllers/Expense.controller.js';

const router = Router();


router.post('/add' , addExpense);

router.get('/getAll' , expenseList);

router.get('/info/:id' , expenseInfo)

export default router;