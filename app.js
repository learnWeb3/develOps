import express from "express";
import routing from "./routes/index.js";
import mongoose from 'mongoose'
import "dotenv/config";

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  SERVER_HOST,
  SERVER_PORT,
} = process.env;

const DBURI = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
mongoose
  .connect(DBURI)
  .then((connexion) => {
    const app = express();

    app.set("views", "./views"); // répertoire où se trouvent nos vues
    app.set("view engine", "ejs"); // moteur de modèle à utiliser

    app.use(express.static("public"));
    app.use(express.json()); // pour parser content-type:application/json
    app.use(express.urlencoded({ extended: true })); // pour parser content-type: application/x-www-form-urlencoded
    // true pour utiliser la librairie qs, permets de récuper un objet pur { name: jako,age : 12}
    // false pour utiliser la librairie querystring, permets de récuperer un nested object (objet imbriqué), aussi parse l'url en enlevant le ? de l'url
    app.use(routing);
    app.listen(SERVER_HOST, SERVER_PORT, () => {
      console.log(`app listening at http://${SERVER_HOST}:${SERVER_PORT}`);
    });
  })
  .catch((error) => {
      console.error(error)
  });
