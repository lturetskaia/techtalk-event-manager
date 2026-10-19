import type { RowDataPacket } from 'mysql2';

export interface EventData extends RowDataPacket {
  id: number;
  title: string;
  image_path: string;
  date: string;
  address: string;
}

export interface OrganiserData extends RowDataPacket {
  id: number;
  name: string;
  description: string;
}

export interface TicketTypeData extends RowDataPacket {
  id: number;
  event_id: number;
  type: string;
  price: number;
  quantity_left: number;
  total_quantity: number;
}

export interface UserDetails extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_organiser: boolean;
}

export interface UserTicketData extends RowDataPacket {
  id: number;
  event_id: number;
  ticket_type: string;
  order_id: number;
  title: string;
  date: string;
  address: string;
}
