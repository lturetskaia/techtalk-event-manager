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

interface EventData extends RowDataPacket {
  id: number;
  title: string;
  image_path: string;
  date: string;
  address: string;
}

interface OrganiserData extends RowDataPacket {
  id: number;
  name: string;
  description: string;
}

interface TicketTypeData extends RowDataPacket {
  id: number;
  event_id: number;
  type: string;
  price: number;
  quantity_left: number;
  total_quantity: number;
}

interface UserDetails extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_organiser: boolean;
}

const router = express.Router();

router.get('/events', async (req, res, next) => {
  console.log('Events route');
  console.log(req.session);
  try {
    // Get data from "organiser" table
    const organiserQuery = 'SELECT * FROM organiser';
    const [organiser] = await connection.query<OrganiserData[]>(organiserQuery);

    // Get joint data from "event" and "location" table
    const eventsQuery =
      "SELECT event.id, event.title, event.image_path, event.date, event.description, CONCAT_WS(',', location.building_name, CONCAT_WS(' ', location.building_number, location.street), location.city,location.country, location.postcode) AS address FROM event JOIN location ON event.location_id=location.id WHERE is_published=true ORDER BY event.date ASC ";
    const [events] = await connection.query<EventData[]>(eventsQuery);

    events.forEach((event) => {
      event.date = format(event.date, 'PPp'); // format date to Apr 29, 2027, 12:00 AM
    });

    res.json({ events, organiser: organiser[0] });
  } catch (err) {
    next({
      status: 400,
      message: 'Failed to get events!',
    });
  }
});

// SINGLE EVENT PAGE (ATTENDEE EVENT)
router.get(
  '/events/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.id;
    console.log('One event route');
    console.log(req.session);
    let user: UserDetails | undefined;
    if (req.session.user && req.session.user.role === 'ATTENDEE') {
      //if the user is logged in
      const userId = req.session.user.id;
      //Get logged in user details
      const userQuery = 'SELECT * FROM user WHERE id=?';
      const [userData] = await connection.query<UserDetails[]>(userQuery, [
        userId,
      ]);
      user = userData[0];
    }
    console.log(user);

    try {
      //Get joint event and location data for a specific event id
      const eventsQuery =
        "SELECT event.id, event.title, event.image_path, event.date, event.description, CONCAT_WS(',', location.building_name, CONCAT_WS(' ', location.building_number, location.street), location.city,location.country, location.postcode) AS address FROM event JOIN location ON event.location_id=location.id WHERE is_published=true AND event.id=? ";
      const [events] = await connection.query<EventData[]>(eventsQuery, [
        eventId,
      ]);

      let event;
      if (events.length == 1) {
        event = events[0];
        event!.date = format(event!.date, 'PPp'); // format date to Apr 29, 2027, 12:00 AM
      } else {
        throw Error('Wrong number of events');
      }

      // Get tickets for the specific event from ticketType
      const ticketQuery = 'SELECT * FROM ticketType WHERE event_id=?';
      const [tickets] = await connection.query(ticketQuery, [eventId]);

      res.json({ event, tickets, user });
    } catch (err) {
      next({
        status: 500,
        message: 'Internal server error',
      });
    }
  },
);

// POST: PROCESSING EVENT BOOKING DATA
router.post(
  '/events/:id/book',
  validateBooking,
  validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    // Get errors from validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If there are any errors, pass the error to error handling middleware
      const err = {
        status: 400,
        message:
          'Bad input! Please check your booking information and try again.',
      };
      return next(err);
    }

    const eventId = req.params.id;
    const bookingData = req.body;

    try {
      await connection.query('BEGIN');

      // Get standard tickets for the specific event from ticketType
      const standardTicketQuery =
        "SELECT * FROM ticketType WHERE event_id=? AND type='standard'";
      const [standardTickets] = await connection.query<TicketTypeData[]>(
        standardTicketQuery,
        [eventId],
      );

      // Get concession tickets for the specific event from ticketType
      const concessionTicketQuery =
        "SELECT * FROM ticketType WHERE event_id=? AND type='concession'";
      const [concessionTickets] = await connection.query<TicketTypeData[]>(
        concessionTicketQuery,
        [eventId],
      );

      if (standardTickets.length === 0 && concessionTickets.length === 0) {
        // if no tickets have been found for both events show error
        next({
          status: 400,
          message: 'No tickets have been found for this event.',
        });
        return;
      }

      // Calculate new ticket quantity
      const newStandardTicketQuantity =
        (standardTickets[0]?.quantity_left || 0) - bookingData.standard;
      const newConcessionTicketQuantity =
        (concessionTickets[0]?.quantity_left || 0) - bookingData.concession;

      // If required ticket quantity is more than the tickets left, show an error
      if (newStandardTicketQuantity < 0 || newConcessionTicketQuantity < 0) {
        const err = {
          status: 400,
          message:
            'Some of the tickets you are trying to order are not available. Please check the ticket information and try again.',
        };
        return next(err);
      }

      // Adjust the quantity of tickets left in the database
      if (bookingData.standard > 0) {
        // Decrease the remaining quantity of the standard tickets for the event in ticketType
        const ticketChangeQuery =
          "UPDATE ticketType SET quantity_left=? WHERE event_id=? AND type='standard'";
        await connection.query(ticketChangeQuery, [
          newStandardTicketQuantity,
          eventId,
        ]);
      }

      if (bookingData.concession > 0) {
        // Decrease the remaining quantity of the concession tickets for the event in ticketType
        const ticketChangeQuery =
          "UPDATE ticketType SET quantity_left=? WHERE event_id=? AND type='concession'";
        await connection.query(ticketChangeQuery, [
          newConcessionTicketQuantity,
          eventId,
        ]);
      }

      // Add a new user order to userOrders
      const newOrderQuery =
        'INSERT INTO userOrder (first_name, last_name, email, phone) VALUES (?,?,?,?)';
      const [newOrderResult] = await connection.query<ResultSetHeader>(
        newOrderQuery,
        [
          bookingData.first_name,
          bookingData.last_name,
          bookingData.email,
          bookingData.phone,
        ],
      );

      // Add a ticket entry for every standard ticket bought
      if (bookingData.standard > 0) {
        for (let i = 0; i < bookingData.standard; i++) {
          const newTicketQuery =
            'INSERT INTO ticket (event_id, ticket_type, order_id) VALUES(?,?,?)';
          await connection.query(newTicketQuery, [
            eventId,
            'standard',
            newOrderResult.insertId,
          ]);
        }
      }

      // Add a ticket entry for every concession ticket bought
      if (bookingData.concession > 0) {
        for (let i = 0; i < bookingData.concession; i++) {
          const newTicketQuery =
            'INSERT INTO ticket (event_id, ticket_type, order_id) VALUES(?,?,?)';
          await connection.query(newTicketQuery, [
            eventId,
            'concession',
            newOrderResult.insertId,
          ]);
        }
      }

      // Commit transaction
      await connection.query('COMMIT');
    } catch (err) {
      // Roll back any changes made if there is an error
      await connection.query('ROLLBACK');
      console.log(err);
      return next({
        status: 500,
        message:
          'Failed to book the tickets. Check ticket information or try again later.',
      });
    }

    res.status(200).json({ message: 'Tickets booked successfully.' });
  },
);

export default router;
