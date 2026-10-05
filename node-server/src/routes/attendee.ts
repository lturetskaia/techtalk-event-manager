import express from 'express';
import type { QueryResult, RowDataPacket } from 'mysql2';
import { connection } from './../app.js';
import { format } from 'date-fns';

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

export default router;
