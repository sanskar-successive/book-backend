export interface IUser {
  firstName: string;
  lastName?: string;
  contact : {
    email: string;
    phone ?: number;
  };
  password: string;
  confirmPassword: string;
}
