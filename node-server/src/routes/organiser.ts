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
  OrganiserRawEventData,
  OrganiserData,
} from '../utils/types.js';
import { formatOrganiserEventData } from '../utils/helperFunctions.js';
import { getCurrentDateTime } from '../utils/helperFunctions.js';
import { upload } from '../middleware/multerUploader.js';
import fs from 'fs';
import { format, formatISO } from 'date-fns';

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

      //skip deleting the default image
      if (fs.existsSync(path) && imagePath !== 'default_img.png') {
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

    let imagePath = 'default-img.png';

    if (req.file) {
      //change image path if user provided an image
      imagePath = req.file.filename;
      // imagePath = imagePath.replace('./public', '');
    }

    if (!errors.isEmpty()) {
      const path = './public/images/' + imagePath;

      //delete the saved image
      if (fs.existsSync(path) && imagePath !== 'default_img.png') {
        fs.rmSync(path);
      }

      return next({
        status: 400,
        message:
          'Bad input! Please check the entered event information and try again.',
      });
    }

    const inputData = req.body;

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

      const path = './public/images/' + imagePath;

      //delete the saved image
      if (fs.existsSync(path) && imagePath !== 'default_img.png') {
        fs.rmSync(path);
      }

      next({
        status: 500,
        message:
          'Failed to create a new event. Check the input or try again later.',
      });
    }
  },
);

//GET EVENT DATA BY ID
router.get(
  '/events/:id',
  requireAuth,
  verifyRole('ORGANISER'),
  async (req: Request, res: Response, next: NextFunction) => {
    const eventId = req.params.id;

    try {
      // Get data from "event" by event id
      const eventsQuery = `SELECT event.id, event.title, event.image_path, event.date, event.description, event.create_date, event.publish_date, event.is_published, event.create_date, event.publish_date, event.modified_date, 
      location.building_name, location.building_number, location.street, 
      location.city, location.country, location.postcode
      FROM event 
      JOIN location 
      ON event.location_id=location.id
      WHERE event.id=?`;
      const [eventsData] = await connection.query<OrganiserRawEventData[]>(
        eventsQuery,
        [eventId],
      );

      // Get data from "ticketType"  by event id
      const ticketsQuery =
        'SELECT * FROM ticketType WHERE ticketType.event_id=?';
      const [ticketsData] = await connection.query<TicketTypeData[]>(
        ticketsQuery,
        [eventId],
      );
      const standardTickets = ticketsData.find(
        (ticket) => ticket.type === 'standard',
      );
      const concessionTickets = ticketsData.find(
        (ticket) => ticket.type === 'concession',
      );

      if (eventsData[0]?.modified_date) {
        eventsData[0].modified_date = format(
          new Date(eventsData[0].modified_date),
          'PPp',
        );
      }
      if (eventsData[0]?.create_date) {
        eventsData[0].create_date = format(
          new Date(eventsData[0].create_date),
          'PPp',
        );
      }

      //Merge events array with ticket types
      const event = {
        ...eventsData[0],
        standardTickets,
        concessionTickets,
      };

      res.json({ ...event });
    } catch (err) {
      next({
        status: 500,
        message: 'Failed to access event data. Please try again later.',
      });
    }
  },
);

// EDIT AN EXISTING DRAFT EVENT
router.post(
  '/events/:id/edit',
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
    const eventId = req.params.id;
    let imagePath;

    try {
      //verify the event is draft
      const eventStatusQuery = 'SELECT is_published FROM event WHERE id=?';
      const [eventStatusQueryResult] = await connection.query<RowDataPacket[]>(
        eventStatusQuery,
        [eventId],
      );
      console.log(eventStatusQueryResult[0]);
      const isDraftEvent =
        eventStatusQueryResult[0] &&
        eventStatusQueryResult[0].is_published == false;
      if (!isDraftEvent) {
        return next({
          status: 400,
          message: 'Published events cannot be edited.',
        });
      }

      //get image path
      if (req.file) {
        //change image path if user provided an image
        imagePath = req.file.filename;
        imagePath = imagePath.replace('./public', '');
      } else {
        //if image was not provided, get it from the db
        const imageQuery = 'SELECT image_path FROM event WHERE id=?';
        const [imageQueryResult] = await connection.query<RowDataPacket[]>(
          imageQuery,
          [eventId],
        );
        imagePath = imageQueryResult[0]?.image_path || 'default-img.png';
      }

      //get locationId
      const locationIdQuery = 'SELECT location_id FROM event WHERE id=?';
      const [locationIdQueryResult] = await connection.query<RowDataPacket[]>(
        locationIdQuery,
        [eventId],
      );
      const locationId = locationIdQueryResult[0]?.location_id;

      await connection.query('BEGIN');

      // update the location
      const updateLocationQuery = `UPDATE location SET postcode=?, country=?, city=?, street=?, building_number=?, building_name=? WHERE id=?`;
      //returns the last created/modified id
      const [locationResult] = await connection.query<ResultSetHeader>(
        updateLocationQuery,
        [
          inputData.postcode,
          inputData.country,
          inputData.city,
          inputData.street,
          inputData.buildingNumber,
          inputData.buildingName,
          locationId,
        ],
      );

      //update event
      const updateEventQuery = `UPDATE event SET modified_date=CURRENT_TIMESTAMP, date=?, title=?, description=?, image_path=? WHERE id=?`;
      const [eventResult] = await connection.query<ResultSetHeader>(
        updateEventQuery,
        [
          inputData.date,
          inputData.title,
          inputData.description,
          imagePath,
          eventId,
        ],
      );

      // update standard ticket info
      const updateTicketTypeQuery = `UPDATE ticketType SET price=?, total_quantity=? WHERE event_id=? and type=?`;
      await connection.query(updateTicketTypeQuery, [
        inputData.standardPrice,
        inputData.standardQuantity,
        eventId,
        'standard',
      ]);

      // update concession ticket info
      await connection.query(updateTicketTypeQuery, [
        inputData.concessionPrice,
        inputData.concessionQuantity,
        eventId,
        'concession',
      ]);

      await connection.query('COMMIT');

      res.json({ message: 'The event has been updated' });
    } catch (err) {
      console.log(err);
      await connection.query('ROLLBACK');
      next({
        status: 500,
        message:
          'Failed to update the event. Check the input or try again later.',
      });
    }
  },
);
export default router;
