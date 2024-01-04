import mongoose from "mongoose";

class DBConnection {
  private static instance: DBConnection;
  private mongoUri: string = "mongodb://127.0.0.1:27017/testdb";

  private constructor() {}

  public static getInstance = (): DBConnection => {
    if (!DBConnection.instance) {
      DBConnection.instance = new DBConnection();
    }
    return DBConnection.instance;
  };

  public connectDB = async (): Promise<void> => {
    try {
      await mongoose.connect(this.mongoUri);
      console.log("db connected successfully");
    } catch (err) {
      console.log("connection to db failed");
    }
  };

  public closeDBConnection = async (): Promise<void> => {
    await mongoose.connection.close();
  };
}

export default DBConnection;
