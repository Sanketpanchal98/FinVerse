import AsyncHandler from '../Utils/AsyncHandler.js'
import ResponseHandler from '../Utils/ResponseHandler.js'
import ErrorHandler from '../Utils/ErrorHandler.js'
import { User } from '../Models/User.model.js';
import { Expense } from '../Models/Expense.model.js';

const addExpense = AsyncHandler( async(req, res) => {

    const { amount, category="Other", note="" ,date=new Date().toISOString().split('T')[0] } = req.body;
    
    if(!amount || !category || !date){
        throw new ErrorHandler(400, "All Data needed : addExpense");
    }
    
    const user = await User.findById(req.user); 
    
    if(!user){
        throw new ErrorHandler(404, 'User not found : addEXP');
    }
    let expense;
    try {
        const expenseBlock = await Expense.create({
            note : note ? note : "",
            date,
            amount,
            category,
            owner : user._id
        })
        expense = expenseBlock
    } catch (error) {
        throw new ErrorHandler(500, "internal server error", error)
    }
    
    res.status(200)
    .json(
        new ResponseHandler(200 , 'Expense Created Successfully', expense)
    )

});

const expenseList = AsyncHandler( async ( req, res ) => {

    const userId = req.user;

    if(!userId){
        throw new ErrorHandler(401, "unauthorized req : expenseList");
    }

    const expenses = await Expense.find({
        owner : userId
    }).sort({x : 1});

    const sortedLatest = expenses.slice(0, 100);

    res.status(200)
    .json(
        new ResponseHandler(200, "Expense Fetched successfully", sortedLatest)
    )

})

const expenseInfo = AsyncHandler( async ( req, res ) => {

    const { id:expId } = req.params;
    
    
    if(!expId){
        throw new ErrorHandler( 400, 'Expense Id jaruri Hoti hai bhaya' )
    }

    const expense = await Expense.findById(expId);

    if(!expense){
        throw new ErrorHandler(404, "Expense in not in db : expenseInfo")
    }
    
    if(expense.owner != req.user){
        throw new ErrorHandler(401, 'unauthorized req : expInfo')
    }

    res.status(200)
    .json(
        new ResponseHandler(200, 'expense fetched succesfully', expense)
    )

})

const deleteExpense = AsyncHandler( async (req, res) => {

    try {
        const { expenseId } = req.params;
        
        if(!expenseId){
            throw new ErrorHandler(401, "All data required");
        }
        console.log(expenseId);
        
        const userId = req.user;
        
        const expense = await Expense.findById(expenseId);
        
        
        if(userId != expense.owner.toString()){
            throw new ErrorHandler(401, "Unautorized user")
        }
        
        const result = await Expense.findByIdAndDelete(expense._id);
    } catch (error) {
        throw new ErrorHandler(400, "Internal server Error", error);
    }

    res.status(200)
    .json(
        new ResponseHandler(200, "Expense Deleted Successfully")
    )

})

export {
    addExpense,
    expenseList,
    expenseInfo,
    deleteExpense
}