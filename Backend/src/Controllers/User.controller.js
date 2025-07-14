import AsyncHandler from '../Utils/AsyncHandler.js'
import ResponseHandler from '../Utils/ResponseHandler.js'
import ErrorHandler from '../Utils/ErrorHandler.js'
import { User } from '../Models/User.model.js'
import { accessTokenOptions, refreshTokenOptions } from '../Constants/cookieOptions.js'
import jwt from 'jsonwebtoken'

const RefreshAccessTokenGeneration = async (id) => {

    const user = await User.findById(id);

    const refreshToken = await user.refreshTokenGen();
    const accessToken = await user.accessTokenGen();
    
    if(!refreshToken || !accessToken) throw new ErrorHandler(500 , "Token Generation failed : token generation function")

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false});

    return {
        accessToken,
        refreshToken
    }

}

const UserRegister = AsyncHandler ( async (req , res) => {

    const { name, password, email } = req.body    

    if(!name || !password){
        throw new ErrorHandler(400 , "All info Required : userregister")
    }

    const user = await User.create({
        name,
        password
    })


    if(!user) throw new ErrorHandler(500, "user creation failed : userregister")

    const {accessToken,refreshToken } = await RefreshAccessTokenGeneration(user._id);

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    
    res.status(200)
    .cookie('AccessToken' , accessToken , accessTokenOptions)
    .cookie('RefreshToken' , refreshToken, refreshTokenOptions)
    .json(
        new ResponseHandler(200 , "User Registered in SuccessFully", userObj)
    )

})

const UserLogin = AsyncHandler( async (req , res) => {

    const { name, password } = req.body
    
    if(!name || !password){
        throw new ErrorHandler(401 , " All data needed : userlogin ")
    }
    
    const user = await User.findOne({name});
    
    if(!user) throw new ErrorHandler(404 , "user not found : userlogin");

    const result = await user.passwordVerification(password);

    if(!result) throw new ErrorHandler(400 , "password incorrect : userlogin");

    const {accessToken,refreshToken } = await RefreshAccessTokenGeneration(user._id);

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    
    res.status(200)
    .cookie('AccessToken' , accessToken , accessTokenOptions)
    .cookie('RefreshToken' , refreshToken, refreshTokenOptions)
    .json(
        new ResponseHandler(200 , "User logged in SuccessFully", userObj)
    )

})

const UserInfo = AsyncHandler(async (req ,res) => {

    const userId = req.user;
    
    const user = await User.findById(userId).select("-password -refreshToken");

    if(!user){
        new ResponseHandler(200, "user not logged in", null)
    }

    res.status(200)
    .json(
        new ResponseHandler(200, 'User Fetched Successfully : userinfo', user)
    )

})

const UserLogOut = AsyncHandler( async (req , res) => {

    res.status(200)
    .clearCookie('AccessToken', accessTokenOptions)
    .clearCookie('RefreshToken', refreshTokenOptions)
    .json(
        new ResponseHandler(200, 'User logged out sucessFully')
    )

})

const accessTokenRefresh = AsyncHandler( async( req , res) => {    
    
    const { RefreshToken } = req.cookies;

    if(!RefreshToken){
        throw new ErrorHandler(401, 'Unauthorized RefreshToken : accestokenrefresh');
    }

    const decodedToken = await jwt.verify(RefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken.id);

    if(!user){
        throw new ErrorHandler(401, "refresh changed : accesstokenrefresh")
    };

    if(user.refreshToken != RefreshToken){
        throw new ErrorHandler(401, 'refresh Token altered ; 136');
    }

    const {refreshToken, accessToken} = await RefreshAccessTokenGeneration(user._id);
    
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    
    res.status(200)
    .cookie('AccessToken' , accessToken , accessTokenOptions)
    .cookie('RefreshToken' , refreshToken, refreshTokenOptions)
    .json(
        new ResponseHandler(200 , "Token updated suuccessFully", userObj)
    )

})

export {
    UserRegister,
    UserLogin,
    UserInfo,
    UserLogOut,
    accessTokenRefresh
}