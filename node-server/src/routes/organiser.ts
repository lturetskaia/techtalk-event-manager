import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { connection } from './../app.js';
import { format } from 'date-fns';
import {
  validateBooking,
  validateUser,
} from './../middleware/dataValidator.js';
import { validationResult } from 'express-validator';
import { requireAuth, verifyRole } from '../middleware/auth.js';

const router = express.Router();

//ORGANISER HOME PAGE - DISPLAY ALL EVENTS
router.get(
  '/dashboard',
  requireAuth,
  verifyRole('ORGANISER'),
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('Inside organiser dashboard');
    // try {
    //   // Get data from "organiser" table
    //   const organiserQuery = 'SELECT * FROM organiser';
    //   const organiser = await connection.query(organiserQuery);

    //   // Get data from "event" ordered by event date
    //   const eventsQuery = 'SELECT * FROM event ORDER BY event.date ASC';
    //   const eventsData = await fetchData(eventsQuery);

    //   // Get data from "ticketType"
    //   const ticketsQuery = 'SELECT * FROM ticketType';
    //   const ticketsData = await fetchData(ticketsQuery);

    //   //Create a new events array with compiled addresses
    //   const events = [];
    //   eventsData.forEach((event) => {
    //     const formattedEvent = formatOrganiserEventData(event, ticketsData);
    //     events.push(formattedEvent);
    //   });

    //   res.render('pages/organiser/organiser-home.ejs', {
    //     organiser: organiser[0],
    //     events: events,
    //     pageId: 'home',
    //   });
    //   } catch (err) {
    //     next({
    //       status: 500,
    //       message: 'Failed to access event data. Please try again later.',
    //     });
    //   }

    res.json({ message: 'Organiser dashboard' });
  },
);

export default router;
