// import 'date-fns';

// Formats attendee event data into an object
// function formatAttendeeEventData(event) {
//   let addressLine = '';

//   if (event.building_name) {
//     addressLine += event.building_name + ', ';
//   }

//   if (event.building_number) {
//     addressLine += event.building_number + ' ';
//   }

//   addressLine += `${event.street}, ${event.city}, ${event.country}, ${event.postcode}`;

//   const formattedEvent = {
//     id: event.id,
//     title: event.title,
//     date: event.date,
//     address: addressLine,
//     description: event.description,
//     image_path: event.image_path,
//   };

//   return formattedEvent;
// }

// const formatAttendeeTicketData = (ticket) => {
//   let addressLine = '';

//   if (ticket.building_name) {
//     addressLine += ticket.building_name + ', ';
//   }

//   if (ticket.building_number) {
//     addressLine += ticket.building_number + ' ';
//   }

//   addressLine += `${ticket.street}, ${ticket.city}, ${ticket.country}, ${ticket.postcode}`;

//   const formattedEvent = {
//     id: ticket.id,
//     event_title: ticket.title,
//     event_date: ticket.date,
//     address: addressLine,
//     type: ticket.ticket_type,
//     number: ticket.ticket_number,
//   };

//   return formattedEvent;
// };

// // Merges organiser event and tickets data into an object and formats dates
// const formatOrganiserEventData = (event, tickets) => {
//   //find tickets
//   const standardTickets = tickets.find(
//     (ticketType) =>
//       ticketType.event_id === event.id && ticketType.type === 'standard',
//   );

//   const concessionTickets = tickets.find(
//     (ticketType) =>
//       ticketType.event_id === event.id && ticketType.type === 'concession',
//   );

//   const formattedEvent = {
//     ...event,
//   };

//   // set ticket properties only if they exist
//   if (standardTickets) {
//     formattedEvent.standardTickets = standardTickets;
//   }
//   if (concessionTickets) {
//     formattedEvent.concessionTickets = concessionTickets;
//   }

//   // format dates to Apr 29, 2027, 12:00 AM
//   // formattedEvent.modified_date = format(new Date(formattedEvent.modified_date*1000), "PPp");
//   // formattedEvent.create_date = format(new Date(formattedEvent.create_date*1000), "PPp");
//   formattedEvent.modified_date = format(
//     new Date(formattedEvent.modified_date),
//     'PPp',
//   );
//   formattedEvent.create_date = format(
//     new Date(formattedEvent.create_date),
//     'PPp',
//   );
//   formattedEvent.date = format(new Date(formattedEvent.date), 'PPp');

//   if (formattedEvent.publish_date) {
//     formattedEvent.publish_date = format(
//       new Date(formattedEvent.publish_date),
//       'PPp',
//     );
//   }

//   return formattedEvent;
// };

// // Get current date and time formatted to SQL datetime
// function getCurrentDateTime() {
//   let currDate = new Date();
//   currDate.toISOString().slice(0, 19).replace('T', ' ');

//   return currDate;
// }

// // Determines if attendee is logged in
// const attendeeLoggedIn = (sessionData) => {
//   if (sessionData.user && sessionData.user.role === 'attendee') {
//     return true;
//   }
//   return false;
// };

// export { formatAttendeeEventData };
