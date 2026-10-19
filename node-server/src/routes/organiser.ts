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
import type { TicketTypeData, EventData } from '../utils/types.js';
import { formatOrganiserEventData } from '../utils/helperFunctions.js';

const router = express.Router();

//ORGANISER HOME PAGE - DISPLAY ALL EVENTS
router.get(
  '/dashboard',
  requireAuth,
  verifyRole('ORGANISER'),
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('Inside organiser dashboard');
    try {
      // Get data from "organiser" table
      const organiserQuery = 'SELECT * FROM organiser';
      const [organiser] = await connection.query(organiserQuery);

      // Get data from "event" ordered by event date
      const eventsQuery = `SELECT event.id, event.title, event.image_path, event.date, event.description, CONCAT_WS(',', location.building_name, CONCAT_WS(' ', location.building_number, location.street), location.city,location.country, location.postcode) AS address
      FROM event 
      JOIN location 
      ON event.location_id=location.id
      ORDER BY event.date ASC`;
      const [eventsData] = await connection.query<EventData[]>(eventsQuery);
      console.log(eventsData);

      // Get data from "ticketType"
      const ticketsQuery = 'SELECT * FROM ticketType';
      const [ticketsData] =
        await connection.query<TicketTypeData[]>(ticketsQuery);
      console.log(ticketsData);

      //Create a new events array with ticket types
      const events = formatOrganiserEventData(eventsData, ticketsData);

      res.json({ events });
    } catch (err) {
      next({
        status: 500,
        message: 'Failed to access event data. Please try again later.',
      });
    }
  },
);

export default router;
