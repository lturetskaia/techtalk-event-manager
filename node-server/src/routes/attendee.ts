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

const router = express.Router();

router.get('/events', async (req, res, next) => {
  try {
    // Get data from "organiser" table
    const organiserQuery = 'SELECT * FROM organiser';
    const [organiser] = await connection.query(organiserQuery);

    console.log('Getting events from db');

    // Get joint data from "event" and "location" table
    const eventsQuery =
      "SELECT event.id, event.title, event.image_path, event.date, CONCAT_WS(',', location.building_name, CONCAT_WS(' ', location.building_number, location.street), location.city,location.country, location.postcode) AS address FROM event JOIN location ON event.location_id=location.id WHERE is_published=true ORDER BY event.date ASC ";
    const [events] = await connection.query<EventData[]>(eventsQuery);

    events.forEach((event) => {
      event.date = format(event.date, 'PPp'); // format date to Apr 29, 2027, 12:00 AM
    });

    res.json({ events, organiser });
  } catch (err) {
    next({
      status: 400,
      message: 'Failed to get events!',
    });
  }
});

export default router;
