import { Router } from "express";
import passport from "../Utils/passport.js";
import { googleAuth } from "../Controllers/User.controller.js";

const router = Router();

router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);


router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`
  }),
  googleAuth 
);

export default router