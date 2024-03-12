import {Details} from "./events";

export interface RevenuesDetails {
  id: number;
  type_of_revenue: Details;
  event_id: number;
  user: Details;
  amount: number;
  quantity: number;
  unit: Details;
}

export interface RevenuesAnalisysDetails {
  date: string;
  client: string;
  amount: number;


}
