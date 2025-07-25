import { Router } from "express";
import { accessTokenRefresh, otpVerificationValidation, resetPassword, UserLogin, UserRegister } from "../Controllers/User.controller.js";
import { handleOTPRequest, handleOTPVerification } from "../Utils/nodemail.js";

const router = Router()

router.post('/login' , UserLogin)

router.post('/register' , UserRegister)

router.post('/refresh-token', accessTokenRefresh);

router.post('/sendmail', handleOTPRequest);

router.post('/verifyotp', otpVerificationValidation);

router.post('/password-change', resetPassword)

export default router