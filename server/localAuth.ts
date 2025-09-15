import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { verify } from "argon2";
import { storage } from "./storage";
import type { User } from "@shared/schema";

export function setupLocalAuth() {
  // Configure Passport Local Strategy
  passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username: string, password: string, done) => {
      try {
        // Try to find user by username first, then by email if not found
        let user = await storage.getUserByUsername(username);
        if (!user) {
          user = await storage.getUserByEmail(username);
        }

        if (!user) {
          return done(null, false, { message: 'Invalid username or password' });
        }

        if (!user.password) {
          return done(null, false, { message: 'Account does not have a password set. Please use social login.' });
        }

        // Verify password
        const isValid = await verify(user.password, password);
        if (!isValid) {
          return done(null, false, { message: 'Invalid username or password' });
        }

        // Return user without password for security
        const safeUser = {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };

        return done(null, safeUser);
      } catch (error) {
        console.error('Local authentication error:', error);
        return done(error);
      }
    }
  ));

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, { type: 'local', userId: user.id });
  });

  // Deserialize user from session
  passport.deserializeUser(async (sessionData: any, done) => {
    try {
      if (sessionData.type === 'local') {
        const user = await storage.getUser(sessionData.userId);
        if (user) {
          // Return user without password for security
          const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          };
          return done(null, safeUser);
        }
      }
      return done(null, false);
    } catch (error) {
      console.error('User deserialization error:', error);
      return done(error);
    }
  });
}