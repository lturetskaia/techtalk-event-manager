import type { TicketTypeData, EventData } from '../utils/types.js';

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
  });

  return events;
};
