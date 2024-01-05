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
      res.status(200).json({message : "users fetched successfully", users})
    } catch (error) {
      res.status(404).json(error);
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const user: IUser | null = await this.userService.getById(userId);
      res.status(200).json({message : "user fetched successfully", user});
    } catch (error) {
      res.status(404).json(error)
    }
  };

  public createNew = async (req: Request, res: Response): Promise<void> => {
    try {
      const user: IUser | null = await this.userService.createNew(req.body);
      res.status(201).json({message : "user created successfully", user});
    } catch (error) {
      res.status(404).json(error)
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
      res.status(201).json({ message: "user updated successfully", updatedUser });
    } catch (error) {
      res.status(404).json(error)
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const deletedUser: IUser | null = await this.userService.delete(userId);
      res.status(200).json({ message: "user deleted successfully", deletedUser });
    } catch (error) {
      res.status(404).json(error)
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const userDetails: ILogin = req.body;
      const userInDb: IUser | null = await this.userService.getByEmail(
        userDetails.email
      );

      if (!userInDb)
        res.status(403).json({ message: "user not found (invalid email" });
      else if (userInDb.password !== userDetails.password) {
        res.status(403).json({ message: "user invalid password" });
      } else {
        const token: string = jwt.sign(userDetails, "123");
        res.cookie("authToken", token);
        res.status(200).json({ message: "user logged in successfully" });
      }
    } catch (error) {
      res.status(404).json(error)
    }
  };
}
export default UserController;
