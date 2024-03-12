import {Details} from "./events";


export interface EventCostsDetails {
  id: number;
  event_id: number;
  client: Details;
  type_of_cost: Details;
  amount: number;
  description: string;
  user: Details;
  date: Date;
}


export interface CostsDetails {
  id: number;
  date: string;
  client: Details;
  type_of_cost: Details;
  amount: number;
  description: string;
  user: Details;
}
