import type { TicketTypeData, EventData } from '../utils/types.js';
import { format } from 'date-fns';

// Merges organiser event and tickets data into an object
export const formatOrganiserEventData = (
  events: EventData[],
  tickets: TicketTypeData[],
) => {
  events.forEach((event) => {
    //find ticket types for the event
    const standardTickets = tickets.find(
      (ticketType) =>
        ticketType.event_id === event.id && ticketType.type === 'standard',
    );

    const concessionTickets = tickets.find(
      (ticketType) =>
        ticketType.event_id === event.id && ticketType.type === 'concession',
    );

    // set ticket properties only if they exist
    if (standardTickets) {
      event.standardTickets = standardTickets;
    }
    if (concessionTickets) {
      event.concessionTickets = concessionTickets;
    }

    event.modified_date = format(new Date(event.modified_date), 'PPp');
    event.create_date = format(new Date(event.create_date), 'PPp');
    event.date = format(new Date(event.date), 'PPp');
    if (event.publish_date) {
      event.publish_date = format(new Date(event.publish_date), 'PPp');
    }
  });

  return events;
};
