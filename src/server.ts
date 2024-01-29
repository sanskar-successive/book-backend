import express, { Application } from "express";
import DBConnection from "./lib/config/dbConnection";
import router from "./router";
import cookieParser from "cookie-parser";
import notFoundMiddlware from "./lib/middlewares/notFound.middlware";
import loggerMiddleware from "./lib/middlewares/logger.middleware";
import cors from "cors";
import swaggerSpec from './swaggerConfig'
import swaggerUi from "swagger-ui-express";
import compression from 'compression'
import { expressMiddleware } from "@apollo/server/express4";
import { createApolloServer } from './graphql/apolloServer';

class Server {
  private static instance: Server;
  private app: Application;
  private dbConnection: DBConnection;

  constructor(dbConnection: DBConnection) {
    this.app = express();
    this.dbConnection = dbConnection;
    this.config();
    this.setRoutes();
    // this.setNotFound();
  }
  private config = async (): Promise<void> => {
    this.app.use(compression())
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(loggerMiddleware);
  };

  public static getInstance(dbConnection: DBConnection): Server {
    if (!Server.instance) {
      Server.instance = new Server(dbConnection);
    }
    return Server.instance;
  }

  private setRoutes = async () => {
    this.app.use(router);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.app.use("/graphql", expressMiddleware(await createApolloServer()));
    this.app.use(notFoundMiddlware);
  };

  public start = async (PORT: number) => {
    await this.dbConnection.connectDB();
    this.app.listen(PORT, () => {
      console.log(`server running on PORT ${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  };

  public getApp = (): Application => {
    return this.app;
  };
}

export default Server;
