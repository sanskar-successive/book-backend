import express, { Application } from "express";
import DBConnection from "./lib/config/dbConnection";
import router from "./router";
import cookieParser from "cookie-parser";
import notFoundMiddlware from "./lib/middlewares/notFound.middlware";
import loggerMiddleware from "./lib/middlewares/logger.middleware";
import cors from 'cors'

class Server {
  private app: Application;
  private dbConnection : DBConnection;

  constructor(dbConnection : DBConnection) {
    this.app = express();
    this.dbConnection = dbConnection;
    this.config();
    this.setRoutes();
    this.setNotFound();
        // this.setErrorHandler();
  }
  private config = async (): Promise<void> => {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(loggerMiddleware);
  };

  private setRoutes = (): void => {
    this.app.use(router);
  };
  private setNotFound = (): void => {
    this.app.use(notFoundMiddlware);
  };

  // private setErrorHandler = (): void => {
  //   this.app.use(errorMiddleware);
  // };

  public start = async (PORT: number) => {
    await this.dbConnection.connectDB();
    this.app.listen(PORT, () => {
      console.log(`server running on PORT ${PORT}`);
    });
  };
}

export default Server;
