import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();

app.use(cookieParser());

app.use(express.urlencoded());

app.use(express.static('public'));

app.use(express.json({limit : '40kb'}));


app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))

//UnProtected Routes

//User routes
import userUnprotectedRoute from './Routes/user.unprotected.routes.js'

app.use( '/api/v1/user', userUnprotectedRoute );

//protected routes

//user routes
import AuthMiddleware from './Middlewares/Auth.js';
app.use(AuthMiddleware)

import userProtectedroute from './Routes/user.protected.routes.js'
import expenseRoute from './Routes/expense.routes.js'
import errorMiddleware from './Middlewares/errorMiddleware.js';

app.use('/api/v1/user/pro' ,userProtectedroute);

app.use('/api/v1/exp', expenseRoute)

// app.use(errorMiddleware)
export default app;