import DBConnection from "./lib/config/dbConnection";
import Server from "./server";

const port = 5000;
const dbConnection = DBConnection.getInstance();
const server = Server.getInstance(dbConnection);
server.start(port);
