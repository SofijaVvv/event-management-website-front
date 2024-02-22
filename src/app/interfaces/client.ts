import {Details} from "./events";

export interface IClient {
  id: number;
  name: string;
  address: string;
  pdvnumber: string;
  pib: string;
  city: string;
  phone: string;
  email: string;
  type_of_client: Details;
  bank_account: string;
  note: string;
}
