import UserRepository from "./repositories/user.repository";
import { IUser } from "./entities/IUser";
import jwt from 'jsonwebtoken';
import ILogin from "./entities/ILogin";

class UserService {
  private repo: UserRepository;

  constructor() {
    this.repo = new UserRepository();
  }

  public getAll = async (): Promise<IUser[] | null> => {
    return await this.repo.getAll();
  };

  public getById = async (userId: string): Promise<IUser | null> => {
    return await this.repo.getById(userId);
  };

  public createNew = async (User: IUser): Promise<IUser | null> => {
    return await this.repo.createNew(User);
  };

  public update = async (
    UserId: string,
    updatedUser: IUser
  ): Promise<IUser | null> => {
    return await this.repo.update(UserId, updatedUser);
  };

  public delete = async (UserId: string): Promise<IUser | null> => {
    return await this.repo.delete(UserId);
  };

  public getByEmail = async (email: string): Promise<IUser | null> => {
    return await this.repo.getByEmail(email);
  };

  static generateLoginToken = (user: ILogin) => {
    const token: string = jwt.sign(user, "123");
    return token;
  };

}

export default UserService;
