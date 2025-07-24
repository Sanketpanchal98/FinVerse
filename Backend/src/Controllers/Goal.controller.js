import AsyncHandler from '../Utils/AsyncHandler.js'
import ResponseHandler from '../Utils/ResponseHandler.js'
import ErrorHandler from '../Utils/ErrorHandler.js'
import { Goal } from '../Models/Goals.model.js'


const addGoal = AsyncHandler( async (req, res) => {
    
    const { title, targetAmount, category, deadline, priority, currentAmount = 0, status } = req.body

    if( !title || !targetAmount || !category || !deadline || !status ){
        throw new ErrorHandler( 400, "All fields are must" )
    }

    const userId = req.user;

    if(!userId){
        throw new ErrorHandler(401, "Unauthorized request")
    }

    const goal = await Goal.create({
        title,
        targetAmount,
        category,
        deadline,
        priority,
        currentAmount,
        status,
        owner : userId
    })

    if(!goal){
        throw new ErrorHandler(500, "Internal Server Error")
    }

    res.status(200)
    .json(
        new ResponseHandler(200, 'Goal created successfully', goal)
    )

});

const updateGoalProgress = AsyncHandler( async (req, res) => {
    
    const { currentAmount, status='active', goalId } = req.body

    if(!currentAmount){
        throw new ErrorHandler(400, "Reham karle bhai amount to add kar")
    }

    const goal = await Goal.findById(goalId);

    if(goal.owner.toString() !== req.user){
        throw new ErrorHandler(401, "Unauthorized request")
    }

    goal.currentAmount = currentAmount;
    goal.status = status;
    const updatedGoal = await goal.save({validateBeforeSave : false});

    if(!updatedGoal){
        throw new ErrorHandler(500, "Internal server error")
    }

    res.status(200)
    .json(
        new ResponseHandler(200 , 'Goal updated successfully', updatedGoal)
    )

} )

const deleteGoal = AsyncHandler( async (req, res) => {
    
    const { goalId } = req.params

    if(!goalId){
        throw new ErrorHandler(400, "Id must be provided")
    }

    const userId = req.user

    const goal = await Goal.findById(goalId)

    if(!goal){
        throw new ErrorHandler(500, "Internal Server Error")
    }

    if(goal.owner.toString() !== userId){
        throw new ErrorHandler(401, "Unauthorized request")
    }

    await Goal.findByIdAndDelete(goal._id);

    res.status(200)
    .json(
        new ResponseHandler(200, "Goal deleted Success")
    )

})

const getAllGoal = AsyncHandler( async (req, res) => {
    
    const userId = req.user;

    try {

        const goals = await Goal.find({
            owner : userId
        })

        if(!goals){
            throw new ErrorHandler(500, "Internal server Error")
        }

        res.status(200)
        .json(
            new ResponseHandler(200, "All goals fetched successfully", goals)
        )

    } catch (error) {
        throw new ErrorHandler(400, "Error", error)
    }

})

export {
    addGoal,
    updateGoalProgress,
    deleteGoal,
    getAllGoal
}