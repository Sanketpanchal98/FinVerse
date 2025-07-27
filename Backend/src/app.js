import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from './Utils/passport.js';
import helmet from 'helmet';
import compression from 'compression';
import xssClean from 'xss-clean'

const app = express();

app.use(cookieParser());

app.use(express.urlencoded());

app.use(express.static('public'));

app.use(express.json({limit : '40kb'}));

app.use(helmet());

app.use(compression({
    threshold : 1024
}))

app.use(xssClean())

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
import userProtectedroute from './Routes/user.protected.routes.js'
import expenseRoute from './Routes/expense.routes.js'
import autopayRoutes from './Routes/autopay.routes.js'
import goalRouter from './Routes/goal.routes.js'
import errorMiddleware from './Middlewares/errorMiddleware.js'
import AuthMiddleware from './Middlewares/Auth.js'

// Unprotected routes
app.use('/api/v1/user', userUnprotectedRoute)
app.use('/api/v1/auth', googleRoutes)

// Protected routes (middleware applied per route)
app.use('/api/v1/user/pro', AuthMiddleware, userProtectedroute)
app.use('/api/v1/exp', AuthMiddleware, expenseRoute)
app.use('/api/v1/autopay', AuthMiddleware, autopayRoutes)
app.use('/api/v1/goal', AuthMiddleware, goalRouter)

// Error handler
app.use(errorMiddleware)

export default app;
