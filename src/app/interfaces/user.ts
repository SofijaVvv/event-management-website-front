export interface IUser {
  id: number;
  email: string;
  key: string;
  activity: boolean;
  name: string;
  roles_combo: { id: number; name: string; };
  telephone: string;
  roles_id: number;
  company_id: number;
}
