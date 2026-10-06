import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import type { RowDataPacket } from 'mysql2';
import { connection } from './../app.js';
import { format } from 'date-fns';
import {
  validateBooking,
  validateUser,
} from './../middleware/dataValidator.js';
import { validationResult } from 'express-validator';

interface EventData extends RowDataPacket {
  id: string;
  title: string;
  image_path: string;
  date: string;
  address: string;
}

interface OrganiserData extends RowDataPacket {
  id: string;
  name: string;
  description: string;
}

const router = express.Router();

router.get('/events', async (req, res, next) => {
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
router.get('/events/:id', async (req, res, next) => {
  const eventId = req.params.id;
  let user = {};
  // if (req.session.user) {
  //   //if the user is logged in
  //   const userId = req.session.user.id;
  //   //Get logged in user details
  //   const userQuery = "SELECT * FROM user WHERE id=?";
  //   user = await fetchFirstItem(userQuery, [userId]);
  // }

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
    // res.render('pages/attendee/attendee-event.ejs', {
    //   user,
    //   event,
    //   tickets,
    //   attendeeLoggedIn: attendeeLoggedIn(req.session),
    //   pageId: 'attendee-event',
    // });
  } catch (err) {
    next({
      status: 500,
      message: 'Internal server error',
    });
  }
});

// POST: PROCESSING EVENT BOOKING DATA
router.post(
  '/events/:id/book',
  validateBooking,
  validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    // Get errors from validation
    const errors = validationResult(req);
    console.log(errors);

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
    let concessionTickets;
    let standardTickets;

    try {
      // Get standard tickets for the specific event from ticketType
      const standardTicketQuery =
        "SELECT * FROM ticketType WHERE event_id=? AND type='standard'";
      standardTickets = await connection.query(standardTicketQuery, [eventId]);

      // Get concession tickets for the specific event from ticketType
      const concessionTicketQuery =
        "SELECT * FROM ticketType WHERE event_id=? AND type='concession'";
      concessionTickets = await connection.query(concessionTicketQuery, [
        eventId,
      ]);
    } catch (err) {
      const error = {
        status: 500,
        message: 'Failed to access ticket data. Please try again later.',
      };
      return next(error);
    }

    console.log(standardTickets, concessionTickets);

    if (!standardTickets && !concessionTickets) {
      // if no tickets have been found for both events show error
      next({
        status: 400,
        message:
          'No tickets have been found for this event. Please try again later.',
      });
      return;
    }

    const newStandardTicketQuantity =
      standardTickets.quantity_left - bookingData.standard;
    const newConcessionTicketQuantity =
      concessionTickets.quantity_left - bookingData.concession;

    // no tickets or user amount of tickets is more than the tickets left -> show an error
    if (newStandardTicketQuantity < 0 || newConcessionTicketQuantity < 0) {
      const err = {
        status: 400,
        message:
          'Some of the tickets you are trying to order are not available. Please check the ticket information and try again.',
      };
      next(err);
      return;
    }

    try {
      // Begin transaction
      await runQuery('BEGIN');

      // Adjust the quantity of tickets left in the database
      if (bookingData.standard > 0) {
        // Decrease the remaining quantity of the standard tickets for the event in ticketType
        const ticketChangeQuery =
          "UPDATE ticketType SET quantity_left=? WHERE event_id=? AND type='standard'";
        await runQuery(ticketChangeQuery, [newStandardTicketQuantity, eventId]);
      }

      if (bookingData.concession > 0) {
        // Decrease the remaining quantity of the concession tickets for the event in ticketType
        const ticketChangeQuery =
          "UPDATE ticketType SET quantity_left=? WHERE event_id=? AND type='concession'";
        await runQuery(ticketChangeQuery, [
          newConcessionTicketQuantity,
          eventId,
        ]);
      }
      const orderNumber = uuidOrder();
      // Add a new user order to userOrders
      const newOrderQuery =
        'INSERT INTO userOrder (order_number, first_name, last_name, email, phone) VALUES (?,?,?,?,?)';
      await runQuery(newOrderQuery, [
        orderNumber,
        bookingData.firstName,
        bookingData.lastName,
        bookingData.email,
        bookingData.phone,
      ]);

      // Add a ticket entry for every standard ticket bought
      if (bookingData.standard > 0) {
        for (let i = 0; i < bookingrData.standard; i++) {
          const tickeNumber = uuidTicket();
          const newTicketQuery =
            'INSERT INTO ticket (event_id, ticket_type, order_id, ticket_number) VALUES(?,?,(SELECT id FROM userOrder WHERE order_number=?), ?)';
          await runQuery(newTicketQuery, [
            eventId,
            'standard',
            orderNumber,
            tickeNumber,
          ]);
        }
      }

      // Add a ticket entry for every concession ticket bought
      if (bookingData.concession > 0) {
        for (let i = 0; i < bookingData.concession; i++) {
          const tickeNumber = uuidTicket();
          const newTicketQuery =
            'INSERT INTO ticket (event_id, ticket_type, order_id, ticket_number) VALUES(?,?,(SELECT id FROM userOrder WHERE order_number=?), ?)';
          await runQuery(newTicketQuery, [
            eventId,
            'concession',
            orderNumber,
            tickeNumber,
          ]);
        }
      }

      // Commit transaction
      await runQuery('COMMIT');
    } catch (err) {
      // Roll back any changes made if there is an error
      await runQuery('ROLLBACK');
      return next({
        status: 500,
        message: 'Failed to save your booking data. Please try again later.',
      });
    }

    res.render('pages/attendee/booking-complete.ejs');
  },
);

export default router;
