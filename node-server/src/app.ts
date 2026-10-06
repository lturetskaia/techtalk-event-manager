// const { validateLogin } = require("./middlewares/dataValidator.js");
// const { validationResult } = require("express-validator");
import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Add all the route handlers in attendeeRoutes/organiserRoutes to the app under dedicated paths
import attendeeRoutes from './routes/attendee.js';
import organiserRoutes from './routes/organiser.js';

// // Set up session config
// import session from 'express-session';

//bcrypt for password hashing
// import bcrypt from 'bcrypt';
// const saltRounds = 10;

const app = express();
const port = 3000;

// DB connection
const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST || '',
  user: process.env.MYSQL_USER || '',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DB || '',
});

// app.use(
//   session({
//     secret: '',
//     resave: false, //do not force resaving sessions
//     saveUninitialized: true, // do not save uninitialise sessions
//     cookie: { secure: false }, // should be false for local environment as there is no https
//   }),
// );
app.use(cors());
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

// // POST: login requests for all users
// app.post('/login', validateLogin, async (req, res, next) => {
//   const errors = validationResult(req);
//   const userData = req.body;

//   //validate login data
//   if (!errors.isEmpty()) {
//     // If there are any errors, pass the error to error handling middleware
//     return next({
//       status: 400,
//       message: 'Bad input! Please check your login information and try again.',
//     });
//   }

//   // Retrieve user data from the db
//   try {
//     // SELECTS user password hash and admin status that matches the provided email from user table
//     const userQuery =
//       'SELECT user.id, user.password_hash, user.is_admin FROM user WHERE user.email=?';
//     const storedUserData = await fetchFirstItem(userQuery, [userData.email]);
//     if (!storedUserData) {
//       return next({
//         status: 500,
//         message:
//           'The user with these credentials has not been found! Check your email and password and try again.',
//       });
//     }

//     bcrypt.compare(
//       userData.password,
//       storedUserData.password_hash,
//       function (err, result) {
//         if (err) {
//           throw Error();
//         }

//         if (result) {
//           req.session.user = { id: storedUserData.id };
//           //Redirect to a dedicated page
//           if (storedUserData.is_admin) {
//             req.session.user.role = 'admin';
//             res.redirect('/organiser/dashboard');
//           } else {
//             req.session.user.role = 'attendee';
//             res.redirect('/attendee');
//           }
//         } else {
//           //return error page
//           return next({
//             status: 500,
//             message:
//               'The user with these credentials has not been found! Check your email and password and try again.',
//           });
//         }
//       },
//     );
//   } catch (err) {
//     return next({ status: 500, message: 'Internal server error.' });
//   }
// });

// app.get('*', function (req, res) {
//   res.render('pages/common/error.ejs', {
//     status: 404,
//     message: 'The requested page was not found!',
//   });
// });
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
