import { User } from "../Models/User.model.js";

const migrateExistingUsers = async () => {
    try {
        console.log('Starting user migration for Google OAuth...');
        
        // Update all existing users to have the new fields
        const result = await User.updateMany(
            { 
                // Only update users who don't have these fields yet
                authProvider: { $exists: false }
            },
            {
                $set: {
                    authProvider: 'local',
                    isEmailVerified: false,
                    // Don't set googleId - it should remain null for local users
                }
            }
        );
        
        console.log(`Migration completed. Updated ${result.modifiedCount} users.`);
        
        
        
    } catch (error) {
        console.error('Migration failed:', error);
    }
};

export default migrateExistingUsers