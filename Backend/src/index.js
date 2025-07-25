import app from "./app.js";
import { configDotenv } from "dotenv";
import DataBaseConnection from "./DB/DataBase.js";

configDotenv({
    path: './.env'
})

DataBaseConnection()
    .then(() => {
        console.log('Database connected suucessfully');
        
    })
    .catch((error) => {
        console.log('There is Error in index : ',error);
        
})