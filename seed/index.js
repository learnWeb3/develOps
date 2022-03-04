import User, { roles } from "../models/user.model.js";
import Category from "../models/category.model.js";
import mongoose from 'mongoose';
import 'dotenv/config'

// registering first admin user
const seedAdmin = async () => {
  try {
    const data = {
      username: "admin",
      password: "Admin22++",
      email: "admin@admin.com",
      password_confirmation: "Admin22++",
      role: roles.admin,
    };
    const user = await User.register(data);
    console.log(user);
    console.log(`admin registered`, JSON.stringify(user, null, 4));
    return user;
  } catch (error) {
    console.error("error while registering seed admin", error);
  }
};

const seedCategories = async () => {
  const seedCategories = [
    "Javascript",
    "PHP",
    "Database",
    "IOT",
    "Blockchain",
    "AI",
  ];
  try {
    const categories = [];
    for (const categoryLabel of seedCategories) {
      const data = {
        label: categoryLabel,
      };
      categories.push(await Category.register(data));
    }
    console.log(
      `categories registered with success`,
      JSON.stringify(categories, null, 4)
    );
    return categories;
  } catch (error) {
    console.error("error while registering seed categories", error);
  }
};


const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME
  } = process.env;

const DBURI = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
mongoose.connect(DBURI).then((connexion) => {
  console.log(`connexion opened with mongodb on port: ${DB_PORT}`)
  seedAdmin()
    .then(() => seedCategories())
    .then(() => process.exit(0));
});
