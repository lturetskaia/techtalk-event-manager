export interface EventData {
  id: number;
  title: string;
  image_path: string;
  date: string;
  address: string;
  description: string;
}

export interface OrganiserEventData extends EventData {
  is_published: boolean;
  publish_date: string;
  create_date: string;
  modified_date: string;
  concessionTickets: TicketData | null;
  standardTickets: TicketData | null;
}

export interface OrganiserRawEventData {
  id: number;
  title: string;
  image_path: string;
  date: string;
  description: string;
  postcode: string;
  country: string;
  city: string;
  street: string;
  building_number: string;
  building_name: string;
  is_published: boolean;
  publish_date: string;
  create_date: string;
  modified_date: string;
  concessionTickets: TicketData | null;
  standardTickets: TicketData | null;
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
  // id: string;
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

export interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface UserLoginData {
  id: number;
  role: 'ATTENDEE' | 'ORGANISER';
}

export interface AuthContextType {
  user: UserLoginData | null;
  isLoading: boolean;
  login: (loginData: LoginData) => Promise<UserLoginData>;
  logout: () => Promise<boolean>;
}

export interface UserTicketData {
  id: number;
  event_id: number;
  ticket_type: string;
  order_id: number;
  title: string;
  date: string;
  address: string;
}
