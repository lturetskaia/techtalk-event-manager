import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import session from 'express-session';
import MySQLSession from 'express-mysql-session';
import cors from 'cors';
import mysql, { type RowDataPacket } from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Add all the route handlers in attendeeRoutes/organiserRoutes to the app under dedicated paths
import attendeeRoutes from './routes/attendee.js';
import organiserRoutes from './routes/organiser.js';
import { validateLogin } from './middleware/dataValidator.js';
import { validationResult } from 'express-validator';

//bcrypt for password hashing
import bcrypt from 'bcrypt';
const saltRounds = 10;

enum UserRoles {
  ATTENDEE = 'ATTENDEE',
  ORGANISER = 'ORGANISER',
}

interface LoginData extends RowDataPacket {
  id: number;
  is_organiser: boolean;
  password_hash: UserRoles;
}

const app = express();
const port = 3000;

// DB connection
const connection = await mysql.createPool({
  host: process.env.MYSQL_HOST || '',
  user: process.env.MYSQL_USER || '',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DB || '',
});

declare module 'express-session' {
  interface Session {
    user?: {
      id: number;
      role: string;
    };
  }
}

// Session setup
const MySQLStore = MySQLSession(session);
const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    checkExpirationInterval: 15 * 60 * 1000, // Clear expired sessions every 15 min (in ms)
    expiration: 24 * 60 * 60 * 1000, // Valid for 24 hours (in ms)
    createDatabaseTable: true,
  },
  connection as any,
);

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false, //do not force resaving sessions
    saveUninitialized: true, // do not save uninitialised sessions
    cookie: {
      secure: process.env.NODE_ENV === 'production', // should be false for local environment as there is no https
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    },
  }),
);

app.use(
  cors({
    origin: 'http://localhost:5173', // Your React app URL (Do NOT use '*')
    credentials: true, // Allows browser to exchange cookies cross-origin
  }),
);
app.use(express.json()); //use bodyparser
app.use(express.static(path.resolve() + '/public')); // set location of static files
app.use('/attendee', attendeeRoutes);
app.use('/organiser', organiserRoutes);

// app.get('/logout', (req, res, next) => {
//   if (req.session) {
//     // Destroy the session
//     req.session.destroy((err) => {
//       if (err) {
//         return next({
//           status: 500,
//           message: 'Could not log out. Please try again.',
//         });
//       }
//     });
//   }
//   res.redirect('/'); //redirect to root
// });

// Returns logged-in user profile if session exists
app.get('/api/me', (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json({ user: req.session.user });
});

// POST: login requests for all users
app.post(
  '/login',
  validateLogin,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const userData = req.body;

    //validate login data
    if (!errors.isEmpty()) {
      // If there are any errors, pass the error to error handling middleware
      return next({
        status: 400,
        message:
          'Bad input! Please check your login information and try again.',
      });
    }

    // Retrieve user data from the db
    try {
      // Selects user password hash and admin status that matches the provided email from user table
      const userQuery =
        'SELECT user.id, user.password_hash, user.is_organiser FROM user WHERE user.email=?';
      const [storedUserData] = await connection.query<LoginData[]>(userQuery, [
        userData.email,
      ]);
      if (!storedUserData || storedUserData.length === 0) {
        return next({
          status: 500,
          message:
            'The user with these credentials has not been found! Check your email and password and try again.',
        });
      }

      bcrypt.compare(
        userData.password,
        storedUserData[0]!.password_hash,
        function (err, result) {
          console.log(userData.password, storedUserData[0]!.password_hash);
          if (err) {
            throw Error();
          }

          if (result) {
            const userPayload = {
              id: storedUserData[0]!.id,
              role: storedUserData[0]!.is_organiser
                ? UserRoles.ORGANISER
                : UserRoles.ATTENDEE,
            };

            req.session.user = userPayload;

            // 3. Return user data including role
            res.json({
              message: 'Login successful',
              user: userPayload,
            });
          } else {
            //return error page
            return next({
              status: 500,
              message:
                'The user with these credentials has not been found! Check your email and password and try again.',
            });
          }
        },
      );
    } catch (err) {
      return next({ status: 500, message: 'Internal server error.' });
    }
  },
);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  const errorMessage = err.message || 'Something went wrong';
  const statusCode = err.status || 500;
  res.status(statusCode).json({ message: errorMessage });
});

// Make the web application listen for HTTP requests
app.listen(port, () => {
  console.log(`Techtalk server listening on http://localhost:${port}`);
});

export { connection };
