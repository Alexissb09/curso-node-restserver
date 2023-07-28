import express from "express";
import cors from "cors";
import { dbConnection } from "../database/config.js";

import { router } from "../routes/user.routes.js";
import { authRouter } from "../routes/auth.routes.js";
import { categoriesRouter } from "../routes/categories.routes.js";
import { productsRouter } from "../routes/products.routes.js";
import { searchRouter } from "../routes/search.routes.js";
import { uploadsRouter } from "../routes/uploads.routes.js";
import fileUpload from "express-fileupload";

export default class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      categories: "/api/categories",
      search: "/api/search",
      products: "/api/products",
      users: "/api/users",
      uploads: "/api/uploads",
    };

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

    // Express file upload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, authRouter);
    this.app.use(this.paths.categories, categoriesRouter);
    this.app.use(this.paths.search, searchRouter);
    this.app.use(this.paths.products, productsRouter);
    this.app.use(this.paths.uploads, uploadsRouter);
    this.app.use(this.paths.users, router);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`listening on localhost:${this.port}`);
    });
  }
}
