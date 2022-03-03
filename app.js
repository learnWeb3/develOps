import express from "express";
import mongoose from "mongoose";
import expressLayouts from "express-ejs-layouts";
import "dotenv/config";
import { join } from "path";
import {
  errorHandler,
  isLoggedIn,
  authGuard,
  flashAlert,
  adminGuard,
  isAdmin,
} from "./middlewares/index.js";
import session from "express-session";
import favicon from "serve-favicon";
import staticRouter from "./routes/static.routes.js";
import usersRouter from "./routes/users.routes.js";
import adminRouter from "./routes/admin.routes.js";
import articlesRouter from "./routes/articles.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import categoryRouter from "./routes/category.routes.js";
import { NotFoundError } from "./base/errors/index.js";

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
    app.set("layout extractScripts", true); // extract partials scripts to script tag just before body tag close
    app.set("extractStyles", true); // extract partials style to style tag in layout
    app.set("layout", "./layouts/layout");

    app.use(express.static("public")); // ASSETS
    app.use(favicon(join(process.cwd(), "public", "favicon.ico"))); // favicon

    // session management
    app.use(
      session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: parseInt(SESSION_EXPIRATION_DELAY_MS),
        },
      })
    );

    // extract session[key] to be used as res.locals[key] to access flash message
    app.use(flashAlert("flash"));

    // verify if a user is logged in and set isLoggedIn property on res.locals
    app.use(isLoggedIn);
    // verify if a user has admin rights and set isAdmin property on res.locals
    app.use(isAdmin);
    // verify user rights to access ressources
    app.use(
      authGuard([
        { path: "/login", method: "GET" },
        { path: "/register", method: "GET" },
        { path: "/login", method: "POST" },
        { path: "/register", method: "POST" },
        { path: "/", method: "GET" },
      ])
    );

    app.use(
      adminGuard([
        { match: "/articles/new", method: "GET" },
        { match: "/articles/?.+", method: "POST" },
        { match: "/articles/?.+/edit", method: "GET" },
        { match: "/articles/?.+/delete", method: "GET" },
        { match: "/articles", method: "POST" },
      ])
    );

    app.use(
      express.json({
        limit: "50mb",
      })
    ); // pour parser content-type:application/json
    app.use(express.urlencoded({ extended: true, limit: "50mb" })); // pour parser content-type: application/x-www-form-urlencoded
    // true pour utiliser la librairie qs, permets de récuper un objet pur { name: jako,age : 12}
    // false pour utiliser la librairie querystring, permets de récuperer un nested object (objet imbriqué), aussi parse l'url en enlevant le ? de l'url
    // routers
    app.use(usersRouter);
    app.use(adminRouter);
    app.use(categoryRouter);
    app.use(articlesRouter);
    app.use(quizRouter);
    app.use(staticRouter);

    app.get("*", (req, res, next) => {
      try {
        throw new NotFoundError(
          "Page does not exists, the page you are looking for could have been deleted or moved somewhere else."
        );
      } catch (error) {
        next(error);
      }
    });
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
