import { Autopay } from "../Models/Autopay.model.js";
import AsyncHandler from "../Utils/AsyncHandler.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import ResponseHandler from "../Utils/ResponseHandler.js";

const filterObj = (obj, ...allowed) => {

    let newObj = {};
    for (const key in obj) {
        if (allowed.includes(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

const addAutopay = AsyncHandler(async (req, res) => {

    // try {
        
        const { name, amount, duration, category = 'Other', nextDate, status = 'Active' } = req.body;

        if (!name || !amount || !duration || !nextDate) {
            throw new ErrorHandler(401, 'All feilds required')
        }

        const userId = req.user;

        const autopay = await Autopay.create({
            name,
            amount,
            duration,
            status,
            nextDate,
            owner: userId,
            category
        })

        if (!autopay) {
            throw new ErrorHandler(500, "Internal Server Error Try again");
        }

        res.status(200)
            .json(new ResponseHandler(200, "Autopay created Successfully", autopay));
    // } catch (error) {
    //     throw new ErrorHandler(500, error)
    // }

})

const removeAutopay = AsyncHandler(async (req, res) => {

    const { autopayId } = req.params;

    if (!autopayId) {
        throw new ErrorHandler(404, "Autopay Doesn't Exists");
    }

    const autopay = await Autopay.findById(autopayId);
    
    if (autopay.owner.toString() !== req.user) {
        throw new ErrorHandler(401, "Unautorized Action")
    }

    const deleteData = await Autopay.findByIdAndDelete(autopay._id);

    if (!deleteData) {
        throw new ErrorHandler(500, "Something Went Wrong, Autopay not deleted")
    }
    
    res.status(200)
    .json(new Response(200, "Autopay Deleted Successfully"));

})

const editAutopay = AsyncHandler(async (req, res) => {
    
    const { autopayId } = req.params
    const filteredObj = filterObj(req.body, 'name', 'amount', 'duration', 'status', 'nextDate');
    
    if (!autopayId) {
        throw new ErrorHandler(401, "Autopay Id not Provided")
    }
    
    const autopay = await Autopay.findById(autopayId);
    
    if (autopay.owner.toString() !== req.user) {
        throw new ErrorHandler(401, "Unauthorized request");
    }
    
    for (const key in filteredObj) {
        autopay[key] = filteredObj[key];
    }
    
    await autopay.save();

    res.status(200)
    .json(
        new ResponseHandler(200, "Autopay", autopay)
    )

})

const fetchAllAutopay = AsyncHandler(async (req, res) => {
    const userId = req.user;

    if (!userId) {
        throw new ErrorHandler(401, "Unauthorized request");
    }

    const autopays = await Autopay.find({
        owner: userId
    })

    res.status(200)
        .json(
            new ResponseHandler(200, "Autopay fetched SucessFully", autopays)
        )

})

export {
    addAutopay,
    removeAutopay,
    editAutopay,
    fetchAllAutopay
}