import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from './Utils/passport.js'

const app = express();

app.use(cookieParser());

app.use(express.urlencoded());

app.use(express.static('public'));

app.use(express.json({limit : '40kb'}));


app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))

app.use(passport.initialize())

app.get('/', (req, res) => {
    res.send('backend is perfect working')
})

//UnProtected Routes
// migrateExistingUsers()
//User routes
import userUnprotectedRoute from './Routes/user.unprotected.routes.js'
import googleRoutes from './Routes/google.routes.js'
app.use( '/api/v1/user', userUnprotectedRoute );
app.use('/api/v1/auth', googleRoutes)

//protected routes

//user routes
import AuthMiddleware from './Middlewares/Auth.js';
app.use(AuthMiddleware)

import userProtectedroute from './Routes/user.protected.routes.js'
import expenseRoute from './Routes/expense.routes.js'
import errorMiddleware from './Middlewares/errorMiddleware.js';
import autopayRoutes from './Routes/autopay.routes.js';
import goalRouter from './Routes/goal.routes.js'

app.use('/api/v1/user/pro' ,userProtectedroute);

app.use('/api/v1/exp', expenseRoute)

app.use('/api/v1/autopay', autopayRoutes);

app.use('/api/v1/goal', goalRouter)

app.use(errorMiddleware)

export default app;