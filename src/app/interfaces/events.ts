export interface IEvents {
  id: number;
  date: string;
  time: string;
  client_name: number;
  type_of_event_name: number;
  event_status_name: number;
  location_name: number;
  event_rating: number;
  user_name: number;
  description: string;
  amount: number;
  number_of_participants: number;

}
export interface Details {
  id: number;
  name: string;
}

export interface EventDetails {
  id: number;
  client: Details;
  type_of_event: Details;
  status_event: Details;
  location: Details;
  user: Details;
  description: string;
  date: Date;
  time: Details;
  event_rating: number;
  number_of_participants: number;
}
