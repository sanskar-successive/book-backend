export interface IUser {
  [x: string]: any;
  firstName: string;
  lastName?: string;
  contact : {
    email: string;
    phone ?: number;
  };
  password: string;
  confirmPassword: string;
}