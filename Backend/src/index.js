import app from "./app.js";
import { configDotenv } from "dotenv";
import DataBaseConnection from "./DB/DataBase.js";

configDotenv({
    path: './.env'
})

DataBaseConnection()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Server Is Running on : " , process.env.PORT);
        })
    })
    .catch((error) => {
        console.log('There is Error in index : ',error);
        
})