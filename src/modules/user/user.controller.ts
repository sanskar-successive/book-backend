import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import ILogin from "./entities/ILogin";
import UserService from "./user.service";
import { IUser } from "./entities/IUser";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const users: IUser[] | null = await this.userService.getAll();
      res.status(200).send({ message: "users fetched successfully", users })
    } catch (error) {
      res.status(404).send(error);
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const user: IUser | null = await this.userService.getById(userId);
      res.status(200).send({ message: "user fetched successfully", user });
    } catch (error) {
      res.status(404).send(error)
    }
  };

  public createNew = async (req: Request, res: Response): Promise<void> => {
    try {
      const user: IUser | null = await this.userService.createNew(req.body);
      res.status(201).send({ message: "user created successfully", user });
    } catch (error) {
      res.status(404).send(error)
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const updatedUserData = req.body;
      const updatedUser: IUser | null = await this.userService.update(
        userId,
        updatedUserData
      );
      res.status(201).send({ message: "user updated successfully", updatedUser });
    } catch (error) {
      res.status(404).send(error)
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const deletedUser: IUser | null = await this.userService.delete(userId);
      res.status(200).send({ message: "user deleted successfully", deletedUser });
    } catch (error) {
      res.status(404).send(error)
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const userDetails: ILogin = req.body;
      const userInDb: IUser | null = await this.userService.getByEmail(
        userDetails.email
      );

      console.log(userInDb);

      if (!userInDb)
        return res.status(403).send({ message: "invalid email", authorised: false });
      if (userInDb.password !== userDetails.password) {
        return res.status(403).send({ message: "invalid password", authorised: false });
      }

      const token: string = jwt.sign(userDetails, "123");
      return res.status(200).send({ message: "logged in successfully", token: token, authorised: true });

    } catch (error) {
      res.status(404).send(error)
    }
  };
}
export default UserController;
