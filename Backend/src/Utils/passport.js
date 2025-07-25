import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../Models/User.model.js';

// Google OAuth Strategy (separate from your JWT middleware)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://finverse-backend-roan.vercel.app/api/v1/auth/google/callback"
}, async (AccessToken, RefreshToken, profile, done) => {
    try {
        
        // Check if user already exists with Google ID
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
            // console.log('Existing Google user found:', user.email);
            return done(null, user);
        }
        
        // Check if user exists with same email (account linking)
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
            // console.log('Linking Google account to existing user:', user.email);
            
            // Link Google account to existing user
            user.googleId = profile.id;
            user.authProvider = user.authProvider === 'local' ? 'both' : 'google';
            user.avatar = profile.photos[0].value;
            user.isEmailVerified = true;
            user.googleAccessToken = AccessToken;
            user.googleRefreshToken = RefreshToken;
            
            await user.save();
            return done(null, user);
        }
        
        // Create new Google user
        // console.log('Creating new Google user:', profile.emails[0].value);
        
        user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            authProvider: 'google',
            isEmailVerified: true,
            avatar : 'prof1',
            googleAccessToken: AccessToken,
            googleRefreshToken: RefreshToken
            // No password needed for Google users
        });
        
        await user.save();
        return done(null, user);
        
    } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error, null);
    }
}));

// Passport serialization (only used during OAuth flow)
// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await User.findById(id);
//         done(null, user);
//     } catch (error) {
//         done(error, null);
//     }
// });

export default passport;