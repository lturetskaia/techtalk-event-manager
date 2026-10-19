// Merges organiser event and tickets data into an object and formats dates
const formatOrganiserEventData = (event, tickets) => {
  //find tickets
  const standardTickets = tickets.find(
    (ticketType) =>
      ticketType.event_id === event.id && ticketType.type === 'standard',
  );

  const concessionTickets = tickets.find(
    (ticketType) =>
      ticketType.event_id === event.id && ticketType.type === 'concession',
  );

  const formattedEvent = {
    ...event,
  };

  // set ticket properties only if they exist
  if (standardTickets) {
    formattedEvent.standardTickets = standardTickets;
  }
  if (concessionTickets) {
    formattedEvent.concessionTickets = concessionTickets;
  }

  // format dates to Apr 29, 2027, 12:00 AM
  // formattedEvent.modified_date = format(new Date(formattedEvent.modified_date*1000), "PPp");
  // formattedEvent.create_date = format(new Date(formattedEvent.create_date*1000), "PPp");
  formattedEvent.modified_date = format(
    new Date(formattedEvent.modified_date),
    'PPp',
  );
  formattedEvent.create_date = format(
    new Date(formattedEvent.create_date),
    'PPp',
  );
  formattedEvent.date = format(new Date(formattedEvent.date), 'PPp');

  if (formattedEvent.publish_date) {
    formattedEvent.publish_date = format(
      new Date(formattedEvent.publish_date),
      'PPp',
    );
  }

  return formattedEvent;
};
