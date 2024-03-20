import {Details} from "./events";

export interface IAssignments {
  id: number,
  opis: string,
  status: number,
  prioritet: number,
  operater_id: number,
  dogadjaj_id: number,
  podsjetnik: string,
  datum_kreiranja: string,
  datum_zavrsetka: string,
}

export interface AssignmentsDetails {
  id: number,
  description: string,
  status: number,
  priority: Details,
  user: Details,
  event_id: number,
  created_date: Date,
  end_date: Date,
  date: string
}


export interface AssignmentsDetailList {
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
  assignments: AssignmentsDetails[]
}
