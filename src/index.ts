import DBConnection from "./lib/config/dbConnection";
import Server from "./server";

const port = 5000;
const server = new Server(DBConnection.getInstance());
server.start(port);
