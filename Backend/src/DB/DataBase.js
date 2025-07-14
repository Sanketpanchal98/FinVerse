import mongoose from "mongoose";
import ErrorHandler from "../Utils/ErrorHandler.js";


const DataBaseConnection = async () => {

    try {
        
        mongoose.connect(process.env.MONGOOSE_URI)
        .then(() => console.log('DataBase Connection Successfull'))
        .catch((err) => console.log('Error : ',err))

    } catch (error) {
        throw new ErrorHandler(400, 'error',error)
    }

}

export default DataBaseConnection;