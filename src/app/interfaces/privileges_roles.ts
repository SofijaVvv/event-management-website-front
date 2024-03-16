export interface IPrivilegesRoles {
  privileges_id: number;
  activity: boolean;
  roles_id: number;
  app_id: number;
  privileges_name: string;
}

export interface IPrivilegesResponse {
  key: string;
  value: IPrivilegesRoles[];
}

