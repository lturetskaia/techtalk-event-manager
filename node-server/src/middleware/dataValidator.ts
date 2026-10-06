/** Data validator based on express-validator */

import { body, param, validationResult } from 'express-validator';

//Booking validation chain
const validateBooking = [
  // Validation and sanitisation rules
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Id is required')
    .isInt({ min: 1 })
    .withMessage('Event ID must be an integer >= 1')
    .toInt(),

  body('standard')
    .trim()
    .default(0)
    .isInt({ min: 0 })
    .withMessage('Standard tickets amount must not be negative')
    .toInt(),

  body('concession')
    .trim()
    .default(0)
    .isInt({ min: 0 })
    .withMessage('Concession tickets amount must not be negative')
    .toInt(),

  // Check if at least one ticket is being purchased
  body().custom((body) => {
    if (body.standard == 0 && body.concession == 0) {
      throw new Error(
        'You must purchase at least one standard or concession ticket',
      );
    }
    return true;
  }),
];

//User validation chain
const validateUser = [
  // Validation and sanitisation rules
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name must be between 2 and 50 characters')
    .isLength({ min: 1, max: 50 })
    .matches(/^[A-Za-z\s-]+$/)
    .withMessage('First name can only contain letters, spaces and hyphens'),

  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[A-Za-z\s-]+$/)
    .withMessage('Last name can only contain letters, spaces and hyphens'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ min: 4, max: 254 })
    .withMessage('Phone number must be between 4 and 254 characters')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 4, max: 50 })
    .withMessage('Phone number must be between 4 and 50 characters')
    .isMobilePhone('any')
    .withMessage('Please enter a valid phone number'),
];

//User validation chain
const validateLogin = [
  // Validation and sanitisation rules
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 5, max: 50 })
    .withMessage('Password must be between 5 and 50 characters.'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ min: 4, max: 254 })
    .withMessage('Phone number must be between 4 and 254 characters')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
];

// Organiser event data validation
const validateEvent = [
  body('date')
    .exists({ checkFalsy: true })
    .withMessage('Event date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO8601 date format')
    .toDate(), // Sanitizes the input into a JavaScript Date object

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 50 })
    .withMessage('Title cannot exceed 50 characters')
    .escape(), // Prevents basic XSS injections

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .escape(),
];

const validateTicketType = [
  body(['standardPrice', 'concessionPrice'])
    .exists()
    .withMessage('Price is required')
    .isFloat({ min: 0.0, max: 999.99 }) //sql type DECIMAL(5,2)
    .withMessage('Price must be a positive number between 0.00 and 99.99')
    // convert string input to a float with 2 decimal places
    .customSanitizer((val) => parseFloat(parseFloat(val).toFixed(2))),

  body(['standardQuantity', 'concessionQuantity'])
    .optional({ values: 'null' }) // Allows null or empty fields
    .isInt({ min: 0, max: 32767 })
    .withMessage('Total quantity must be a positive whole number up to 32,767')
    .toInt(),
];

const validateLocation = [
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 50 })
    .withMessage('Country cannot exceed 50 characters')
    .escape(),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 50 })
    .withMessage('City cannot exceed 50 characters')
    .escape(),

  body('street')
    .trim()
    .notEmpty()
    .withMessage('Street is required')
    .isLength({ max: 50 })
    .withMessage('Street cannot exceed 50 characters')
    .escape(),

  body('building_number')
    .optional({ values: 'null' }) // Allows null or empty inputs
    .trim()
    .isLength({ max: 10 })
    .withMessage('Building number cannot exceed 10 characters')
    .escape(),

  body('building_name')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Building name cannot exceed 50 characters')
    .escape(),

  body('postcode')
    .trim()
    .notEmpty()
    .withMessage('Postcode is required')
    .isLength({ min: 2, max: 15 })
    .withMessage('Postcode must be between 2 and 15 characters')
    // alphanumeric/space validation
    .matches(/^[A-Za-z0-9\s-]+$/)
    .withMessage(
      'Postcode can only contain letters, numbers, spaces, and hyphens',
    )
    // convert the input to uppercase
    .customSanitizer((val) => val.toUpperCase()),
];

// Organiser settings data validation
const validateSiteSettings = [
  body('organiserName')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 50 })
    .withMessage('Site name cannot exceed 50 characters')
    .escape(), // Prevents basic XSS injections

  body('organiserDescription')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Site description cannot exceed 500 characters')
    .escape(),
];

export {
  validateBooking,
  validateUser,
  validateLogin,
  validateEvent,
  validateTicketType,
  validateLocation,
  validateSiteSettings,
};
