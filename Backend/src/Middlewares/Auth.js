import AsyncHandler from "../Utils/AsyncHandler.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import jwt from 'jsonwebtoken'


const AuthMiddleware = AsyncHandler( async(req, res, next)  => {
    
    try {
        
        const accessToken = await req.cookies.AccessToken;
    
        if(!accessToken){
            throw new ErrorHandler(401, 'access Token not found : auth-Mid')
        }
    
        const decodedToken = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    
        req.user = decodedToken.id;
    
        next();
    } catch (error) {
        throw new ErrorHandler(401, `accessToken expired : ${error}`, error)
    }

})

export default AuthMiddleware;