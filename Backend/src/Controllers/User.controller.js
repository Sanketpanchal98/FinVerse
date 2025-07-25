import AsyncHandler from '../Utils/AsyncHandler.js'
import ResponseHandler from '../Utils/ResponseHandler.js'
import ErrorHandler from '../Utils/ErrorHandler.js'
import { User } from '../Models/User.model.js'
import { accessTokenOptions, refreshTokenOptions } from '../Constants/cookieOptions.js'
import jwt from 'jsonwebtoken'
import { handleOTPVerification } from '../Utils/nodemail.js'

const filterObj = (obj, ...allowedFields) => {
    
    let newObj = {};
    for( let key in obj ){
        if(allowedFields.includes(key)){        
            newObj[key] = obj[key]
        }
    }
    return newObj
}

const RefreshAccessTokenGeneration = async (id) => {

    const user = await User.findById(id);

    const refreshToken = await user.refreshTokenGen();
    const accessToken = await user.accessTokenGen();
    
    if(!refreshToken || !accessToken) throw new ErrorHandler(500 , "Token Generation failed")

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false});

    return {
        accessToken,
        refreshToken
    }

}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const UserRegister = AsyncHandler ( async (req , res) => {
    // console.log(req.body);
    
    const { name, password, email } = req.body    
    
    if(!name || !password || !email){
        throw new ErrorHandler(400 , "All info Required")
    }

    const isExistsuser = await User.findOne({
        email
    }) 

    if(isExistsuser){
        throw new ErrorHandler(400, 'User already exists')
    }
    
    const user = await User.create({
        name,
        password,
        email,
        avatar : "prof1"
    })


    if(!user) throw new ErrorHandler(500, "User creation failed")

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

    const { email, password } = req.body
    
    if(!email || !password){
        throw new ErrorHandler(401 , " All data needed : userlogin ")
    }
    
    const user = await User.findOne({email});
    
    if(!user) throw new ErrorHandler(404 , "User not found");

    const result = await user.passwordVerification(password);

    if(!result) throw new ErrorHandler(400 , "Password Incorrect");

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
        new ResponseHandler(200, "User not Logged In", null)
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
        throw new ErrorHandler(401, 'Unauthorized RefreshToken');
    }
    
    const decodedToken = await jwt.verify(RefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const user = await User.findById(decodedToken.id);
    
    if(!user){
        throw new ErrorHandler(401, "refresh changed")
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

const UserProfUpdate = AsyncHandler ( async (req, res) => {

    const obj = filterObj(req.body, "name", "avatar", "gender", "dob","phoneNo", "address", "email")    

    const userId = req.user;
    
    const user = await User.findByIdAndUpdate(userId , obj);

    const userObj = await User.findById(user);
    
    if(!userObj){
        throw new ErrorHandler(404, "User not found")
    }

    res.status(200)
    .json(
        new ResponseHandler(200, "User updated Success", userObj)
    )

})

const UpdatePassword = AsyncHandler( async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword){
        throw new ErrorHandler(401 , "All fields required" )
    }

    const userId = req.user;

    const user = await User.findById(userId);

    if(!user){
        throw new ErrorHandler(404, "User Not found")
    }

    const passwordVerification = await user.passwordVerification(oldPassword);

    if(!passwordVerification){
        throw new ErrorHandler(401, "Password is Incorrect")
    }

    user.password = newPassword;
    await user.save();

    res.status(200)
    .json(
        new ResponseHandler(200, "password updated successfully")
    )

});

const UpdateEmail = AsyncHandler( async (req, res) => {

    const { newEmail, password, currentEmail } = req.body;

    if(!newEmail && !password){
        throw new ErrorHandler(401, "all fields required")
    }

    const userId = req.user;

    const user = await User.findById(userId);

    if(!user){
        throw new ErrorHandler(404, "User Not found");
    }

    if(user.email !== currentEmail){
        throw new ErrorHandler(401, "Current Email doesn't match")
    }

    const passwordVerification = await user.passwordVerification(password);

    if(!passwordVerification){
        throw new ErrorHandler(401, "Password Doesn't Match");
    }

    user.email = newEmail;
    await user.save();

    res.status(200)
    .json(
        new ResponseHandler(200, "User Email Updated Successfully")
    )

});

const googleAuth = AsyncHandler(async (req, res) => {
    // console.log('Enteres here');
  try {
    const user = req.user;
    
    const { accessToken, refreshToken } = await RefreshAccessTokenGeneration(user);

    if (!accessToken || !refreshToken) {
      throw new ErrorHandler(500, "Access token generation failed");
    }

    // Use the user object directly instead of querying again
    // const userObj = {
    //   id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   avatar: user.avatar
    // };
    // console.log('here buddy');
    
    res
      .status(200)
      .cookie('AccessToken', accessToken, accessTokenOptions)
      .cookie('RefreshToken', refreshToken, refreshTokenOptions)
    //   .json(new ResponseHandler(200, "User logged in", userObj))
      .redirect('http://localhost:5173/dashboard')

  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`http://localhost:5173/login`);
  }
});

const otpVerificationValidation = AsyncHandler( async (req, res) => {
    
    const { email, otp } = req.body

    const isCorrect = await handleOTPVerification(email, otp);
    
    if(isCorrect){
        throw new ErrorHandler(401, 'OTP is incorrect')
    }
    
    res.status(200)
    .json(
        new ResponseHandler(200, "otp verified")
    )
})

const resetPassword = AsyncHandler( async (req, res) => {
    
    const { email, newPassword } = req.body

    if(!email || !newPassword){
        throw new ErrorHandler(401, "passsword required")
    }

    const user = await User.findOne({email})
    
    if(!user){
        throw new ErrorHandler(404, "user not found")
    }
    const { accessToken, refreshToken } = await RefreshAccessTokenGeneration(user._id);
    
    user.password = newPassword;
    await user.save()
    

    if(!accessToken || !refreshToken){
        throw new ErrorHandler(500, "token generation failed")
    }

    res.status(200)
    .cookie('AccessToken', accessToken, accessTokenOptions)
    .cookie('RefreshToken', refreshToken, refreshTokenOptions)
    .json(
        new ResponseHandler(200, "user password updated successfully")
    )

} )

export {
    UserRegister,
    UserLogin,
    UserInfo,
    UserLogOut,
    accessTokenRefresh,
    UserProfUpdate,
    UpdatePassword,
    UpdateEmail,
    googleAuth,
    otpVerificationValidation,
    resetPassword
}