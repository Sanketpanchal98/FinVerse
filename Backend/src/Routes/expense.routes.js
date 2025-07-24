import {Router} from 'express'
import { addExpense, expenseList, expenseInfo, deleteExpense } from '../Controllers/Expense.controller.js';

const router = Router();


router.post('/add' , addExpense);

router.get('/getAll' , expenseList);

router.get('/info/:id' , expenseInfo);

router.get('/delete/:expenseId' , deleteExpense);

export default router;