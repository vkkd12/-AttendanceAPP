import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import path from "path";
import ejsMate from "ejs-mate";
const __dirname = path.resolve();
import user from "./model/user.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import router_user from "./router/router_user.js";
import router_student from "./router/router_student.js";
import ExpressError from "./utils/ExpressError.js";

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("serectcode"));

const dbURL = process.env.dbURL;
import mongoose from "mongoose";
mongoose
  .connect(dbURL)
  .then(console.log("connected to DB"))
  .catch((err) => console.log(err));

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("error in Mongo Session Store");
});

let sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1 * 60 * 60 * 1000,
    maxAge: 1 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// import { connect } from "mongoose";
// main().catch((err) => console.log(err));
// async function main() {
//   await connect("mongodb://127.0.0.1:27017/Attendance");
// }

// let sessionOptions = {
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 1 * 60 * 60 * 1000,
//     maxAge: 1 * 60 * 60 * 1000,
//     httpOnly: true,
//   },
// };

app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.succes = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user_info = req.user; // undefined or object containing users info.
  next();
});

app.listen("8080", () => {
  console.log("server running");
});

app.use("/", router_user);
app.use("/sent", router_student);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  res.render("error.ejs", { err });
});
