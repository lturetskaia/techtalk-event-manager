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
import type {
  TicketTypeData,
  OrganiserEventData,
  OrganiserData,
} from '../utils/types.js';
import { formatOrganiserEventData } from '../utils/helperFunctions.js';
import { getCurrentDateTime } from '../utils/helperFunctions.js';

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
      const [organiser] =
        await connection.query<OrganiserData[]>(organiserQuery);

      // Get data from "event" ordered by event date
      const eventsQuery = `SELECT event.id, event.title, event.image_path, event.date, event.description, event.create_date, event.publish_date, event.is_published, event.create_date, event.publish_date, event.modified_date, 
      CONCAT_WS(',', location.building_name, CONCAT_WS(' ', location.building_number, location.street), 
      location.city, location.country, location.postcode) AS address
      FROM event 
      JOIN location 
      ON event.location_id=location.id
      ORDER BY event.date ASC`;
      const [eventsData] =
        await connection.query<OrganiserEventData[]>(eventsQuery);
      console.log(eventsData);

      // Get data from "ticketType"
      const ticketsQuery = 'SELECT * FROM ticketType';
      const [ticketsData] =
        await connection.query<TicketTypeData[]>(ticketsQuery);

      //Create a new events array with ticket types
      const events = formatOrganiserEventData(eventsData, ticketsData);

      res.json({ organiser: organiser[0], events });
    } catch (err) {
      next({
        status: 500,
        message: 'Failed to access event data. Please try again later.',
      });
    }
  },
);

//CHANGE EVENT TO PUBLISHED  (is_published property of an event to true)
router.post(
  '/events/:id/publish',
  requireAuth,
  verifyRole('ORGANISER'),
  async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.id;
    // Get formatted current date and time
    const timestamp = getCurrentDateTime();
    const is_published = true;

    try {
      //change event is_published state to true
      const updateEventQuery =
        'UPDATE event SET is_published=?, publish_date=? WHERE id=?';
      await connection.query(updateEventQuery, [
        is_published,
        timestamp,
        eventId,
      ]);

      return res.status(200).json({ message: 'The event has been published' });
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Failed to update the requested event.' });
    }
  },
);

//DELETE event, ticketTypes and ticketss for a specified event id
router.delete(
  '/events/:id',
  requireAuth,
  verifyRole('ORGANISER'),
  async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.id;

    try {
      await connection.query('BEGIN'); // start new transaction

      //delete tickets with the specified event id from DB
      const deleteTicketsQuery = 'DELETE FROM ticket WHERE event_id=?';
      await connection.query(deleteTicketsQuery, [eventId]);

      //delete ticketType with the specified event id from DB
      const deleteTicketTypesQuery = 'DELETE FROM ticketType WHERE event_id=?';
      await connection.query(deleteTicketTypesQuery, [eventId]);

      //delete event with the specified event id from DB
      const deleteEventQuery = 'DELETE FROM event WHERE id=?';
      await connection.query(deleteEventQuery, [eventId]);

      await connection.query('COMMIT'); // commit transaction
      return res
        .status(200)
        .json({ message: 'The event was successfully deleted' });
    } catch (error) {
      await connection.query('ROLLBACK'); // rollback if there was an error
      res
        .status(400)
        .json({ message: 'Failed to delete the requested event.' });
    }
  },
);

export default router;
