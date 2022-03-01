import express from "express";
import mongoose from "mongoose";
import expressLayouts from "express-ejs-layouts";
import "dotenv/config";
import { errorHandler, isLoggedIn } from "./middlewares/index.js";
import session from "express-session";
import staticRouter from "./routes/static.routes.js";
import usersRouter from "./routes/users.routes.js";
import adminRouter from "./routes/admin.routes.js";
import articlesRouter from "./routes/articles.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import categoryRouter from './routes/category.routes.js';

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  SERVER_HOST,
  SERVER_PORT,
  SESSION_SECRET,
  SESSION_EXPIRATION_DELAY_MS,
} = process.env;

const DBURI = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
mongoose
  .connect(DBURI)
  .then((connexion) => {
    const app = express();

    app.set("views", "./views"); // répertoire où se trouvent nos vues
    app.set("view engine", "ejs"); // moteur de modèle à utiliser
    app.use(expressLayouts); // additionnal middleware to have extended layout capabilities
    app.set("layout extractScripts", true); // extract layout scripts to script tag just before body tag close
    app.set("layout", "./layouts/layout");

    // session management
    app.use(
      session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: parseInt(SESSION_EXPIRATION_DELAY_MS)
        },
      })
    );

    app.use(isLoggedIn);

    app.use(express.static("public")); // ASSETS
    app.use(express.json()); // pour parser content-type:application/json
    app.use(express.urlencoded({ extended: true })); // pour parser content-type: application/x-www-form-urlencoded
    // true pour utiliser la librairie qs, permets de récuper un objet pur { name: jako,age : 12}
    // false pour utiliser la librairie querystring, permets de récuperer un nested object (objet imbriqué), aussi parse l'url en enlevant le ? de l'url
    // routers
    app.use(usersRouter);
    app.use(adminRouter);
    app.use(categoryRouter);
    app.use(articlesRouter);
    app.use(quizRouter);
    app.use(staticRouter);
    // error catching/handling
    app.use(errorHandler);
    app.listen(SERVER_PORT, SERVER_HOST, () => {
      console.log(`app listening at http://${SERVER_HOST}:${SERVER_PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
