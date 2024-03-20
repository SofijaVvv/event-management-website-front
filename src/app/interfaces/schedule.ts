import {Details} from "./events";

export interface ScheduleDetails {
  id: number;
  event_id: number;
  user: { id: number, name: string };
  start_time: Details;
  end_time: Details;
  description: string;
  date: string;
}

export interface ScheduleDetailsList {
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
  schedules: ScheduleDetails[]
}
