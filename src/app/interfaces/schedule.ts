import {Details} from "./events";


export interface ScheduleDetails {
  id: number;
  event_id: number;
  user: { id: number, name: string };
  start_time: Details;
  end_time: Details;
  description: string;
}
