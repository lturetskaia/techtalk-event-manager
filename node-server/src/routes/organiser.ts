import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { connection } from './../app.js';
import {
  validateEvent,
  validateTicketType,
  validateLocation,
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
import { upload } from '../middleware/multerUploader.js';
import fs from 'fs';

const router = express.Router();

//ORGANISER HOME PAGE - DISPLAY ALL EVENTS
router.get(
  '/dashboard',
  requireAuth,
  verifyRole('ORGANISER'),
  async (req: Request, res: Response, next: NextFunction) => {
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
      const imagePathQuery = 'SELECT image_path FROM event WHERE id=?';
      const [result] = await connection.query<RowDataPacket[]>(imagePathQuery, [
        eventId,
      ]);
      const imagePath = result[0]?.image_path;

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

      const path = './public/images/' + imagePath;
      if (fs.existsSync(path) && imagePath !== 'default_image.png') {
        fs.rmSync(path);
      }

      return res
        .status(200)
        .json({ message: 'The event was successfully deleted' });
    } catch (error) {
      console.log(error);
      await connection.query('ROLLBACK'); // rollback if there was an error
      res
        .status(400)
        .json({ message: 'Failed to delete the requested event.' });
    }
  },
);

// CREATE A NEW EVENT
router.post(
  '/events/new-event',
  requireAuth,
  verifyRole('ORGANISER'),
  upload.single('eventImage'), //upload the attached image
  validateEvent,
  validateTicketType,
  validateLocation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req); // data validation result

    if (!errors.isEmpty()) {
      next({
        status: 400,
        message:
          'Bad input! Please check the entered event information and try again.',
      });
    }

    const inputData = req.body;
    let imagePath = 'default-img.png';

    if (req.file) {
      //change image path if user provided an image
      imagePath = req.file.filename;
      imagePath = imagePath.replace('./public', '');
    }

    try {
      await connection.query('BEGIN');

      // create a new location
      const newLocationQuery =
        'INSERT INTO location (postcode, country, city, street, building_number, building_name) VALUES (?,?,?,?,?,?)';
      //returns the last created/modified id
      const [locationResult] = await connection.query<ResultSetHeader>(
        newLocationQuery,
        [
          inputData.postcode,
          inputData.country,
          inputData.city,
          inputData.street,
          inputData.buildingNumber,
          inputData.buildingName,
        ],
      );

      //create a new event
      const newEventQuery =
        'INSERT INTO event (create_date, modified_date, date, title, description, location_id, is_published, image_path) VALUES ( CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,?,?,?,?,?,?)';
      const [eventResult] = await connection.query<ResultSetHeader>(
        newEventQuery,
        [
          inputData.date,
          inputData.title,
          inputData.description,
          locationResult.insertId,
          false, //  new events are created as drafts
          imagePath,
        ],
      );

      // create a new standard ticket type
      const newStandardTicketType =
        'INSERT INTO ticketType (event_id, price, quantity_left, total_quantity, type) VALUES (?,?,?,?,?)';
      await connection.query(newStandardTicketType, [
        eventResult.insertId,
        inputData.standardPrice,
        inputData.standardQuantity,
        inputData.standardQuantity,
        'standard',
      ]);

      // create a new standard ticket type
      const newConcessionTicketType =
        'INSERT INTO ticketType (event_id, price, quantity_left, total_quantity, type) VALUES (?,?,?,?,?)';
      await connection.query(newConcessionTicketType, [
        eventResult.insertId,
        inputData.concessionPrice,
        inputData.concessionQuantity,
        inputData.concessionQuantity,
        'concession',
      ]);

      await connection.query('COMMIT');

      res.json({ message: 'The new event has been created' });
    } catch (err) {
      console.log(err);
      await connection.query('ROLLBACK');
      next({
        status: 500,
        message:
          'Failed to create a new event. Check the input or try again later.',
      });
    }
  },
);

export default router;
