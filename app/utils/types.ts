export interface EventData {
  id: string;
  title: string;
  image_path: string;
  date: string;
  address: string;
  description: string;
}

export interface TicketData {
  id: string;
  event_id: string;
  price: string;
  type: string;
  quantity_left: number;
  total_quantity: number;
}

export interface OrganiserData {
  id: string;
  name: string;
  description: string;
}

export interface UserDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface BookingData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  standard: string;
  concession: string;
}

export interface LoginData {
  email: string;
  password: string;
}
