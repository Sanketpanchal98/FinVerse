import AsyncHandler from '../Utils/AsyncHandler.js'
import ResponseHandler from '../Utils/ResponseHandler.js'
import ErrorHandler from '../Utils/ErrorHandler.js'
import { User } from '../Models/User.model.js';
import { Expense } from '../Models/Expense.model.js';

const addExpense = AsyncHandler( async(req, res) => {

    const { amount, category="Other", note="NA" ,date=new Date().toISOString().split('T')[0] } = req.body;
    
    if(!amount || !category || !note || !date){
        throw new ErrorHandler(400, "All Data needed : addExpense");
    }

    const user = await User.findById(req.user); 

    if(!user){
        throw new ErrorHandler(404, 'User not found : addEXP');
    }

    const expense = await Expense.create({
        note,
        date,
        amount,
        category,
        owner : user._id
    })

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
    });

    res.status(200)
    .json(
        new ResponseHandler(200, "Expense Fetched successfully", expenses)
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


export {
    addExpense,
    expenseList,
    expenseInfo
}