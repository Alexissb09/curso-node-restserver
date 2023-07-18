import express from "express";
import cors from "cors";
import { router } from "../routes/user.routes.js";
import { authRouter } from "../routes/auth.routes.js";
import { dbConnection } from "../database/config.js";

export default class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = "/api/users";
    this.authPath = "/api/auth";

    // Database
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // PARSER
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.usersPath, router);
    this.app.use(this.authPath, authRouter);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`listening on localhost:${this.port}`);
    });
  }
}
