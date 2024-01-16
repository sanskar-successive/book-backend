import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import UserService from "../../modules/user/user.service";
import ILogin from "../../modules/user/entities/ILogin";


const userService = new UserService();
const SECRET_KEY = "123";

const checkUserInDb = async (decoded : ILogin) : Promise<Boolean>=>{
    const user = await userService.getByEmail(decoded?.email);
    if(!user) return false;
    return true;
}

class AuthMiddleware {
  public authenticateUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const authToken = req.headers.authorization;
      console.log(req.headers);
      

      if (!authToken) {
        return res.status(403).send({message : "token not provided", authorised : false});
      } 

      jwt.verify(authToken, SECRET_KEY, async (err, decoded)=>{
        if(!err){
          console.log("decoded jwt payload", decoded);

          const user = await checkUserInDb(decoded as ILogin);

          if(user){
            next();
          }
          else{
            console.log("no user found, delete ho gya");

            return res.status(403).send({message : "no user found", authorised : false})
          }
        }
        else{
          return res.status(403).send({message : "token verification failed", authorised : false});
        }
      })
    } catch (error : unknown) {
      return res.status(404).send({error : error})
    }
  };
}

export default new AuthMiddleware().authenticateUser;
