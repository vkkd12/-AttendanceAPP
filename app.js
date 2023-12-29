import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import path from "path";
import ejsMate from "ejs-mate";
const __dirname = path.resolve();
import List from "./model/studentSchema.js";
import user from "./model/user.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import MongoStore from "connect-mongo";
import utils from "./utils/helper.js";
const { logic } = utils;
import middleware from "./middleware.js";
import mongoose from "mongoose";
const { isLoggedIn, isOwner } = middleware;

const dbURL = process.env.dbURL;

mongoose
  .connect(dbURL)
  .then(console.log("connected to DB"))
  .catch((err) => console.log(err));

// import { connect } from "mongoose";
// main().catch((err) => console.log(err));
// async function main() {
//   await connect("mongodb://127.0.0.1:27017/Attendance");
// }

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("serectcode"));

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
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.listen("8080", () => {
  console.log("server running");
});

app.get("/", isLoggedIn, async (req, res) => {
  // let Listings = await List.find();
  // res.render("student/class.ejs", { Listings });
  res.redirect("/login");
});

app.get("/register", async (req, res) => {
  res.render("student/register.ejs");
});
app.post("/register", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let user_login = new user({ username, email });
    let registered_user = await user.register(user_login, password);
    req.login(registered_user, (err) => {
      if (err) next(err);
      res.redirect("/addStudent");
    });
  } catch (error) {
    res.redirect("/register");
  }
});
app.get("/addStudent", isLoggedIn, async (req, res) => {
  let userID = req.user._id;
  res.render("student/addStudent.ejs", { userID });
});
app.post("/addStudent", isLoggedIn, async (req, res) => {
  try {
    let { name } = req.body;
    let subject = [];
    for (let i = 1; true; i++) {
      let value = `subject${i}`;
      let sub = req.body[value];
      if (sub) {
        let temp = { name: sub, totalDays: 0, attend_days: 0 };
        subject.push(temp);
      } else {
        break;
      }
    }
    let stu = new List({ name, subject });
    await stu.save();
    let adding_student_with_user = await user.findById(req.user._id);

    console.log("before");
    console.log(adding_student_with_user);

    adding_student_with_user.student = stu._id;
    adding_student_with_user.save();

    console.log("after  ");
    console.log(adding_student_with_user);

    res.redirect(`/${stu._id}`);
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
});

app.get("/login", async (req, res) => {
  res.render("student/login.ejs");
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  async (req, res) => {
    if (req.user.student === undefined) {
      res.redirect("/addStudent");
    } else {
      let id = req.user.student._id;
      res.redirect(`/${id}`);
    }
  }
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect("/login");
  });
});

app.get("/:id", isLoggedIn, isOwner, async (req, res) => {
  let { id } = req.params;
  let student = await List.findById(id);

  for (let sub of student.subject) {
    let arr = logic(sub.attend_days, sub.totalDays);
    sub.canBeAbsent = arr[0];
    sub.lectures = arr[1];
  }

  res.render("student/student.ejs", { student });
});

app.post("/:id/present/:id_2", isLoggedIn, async (req, res) => {
  let { id, id_2 } = req.params;
  let stu = await List.findById(id);
  let subject = stu.subject;

  for (let sub of subject) {
    if (sub._id == id_2) {
      sub.totalDays = sub.totalDays + 1;
      sub.attend_days = sub.attend_days + 1;
      await stu.save();
      break;
    }
  }

  res.redirect(`/${id}`);
});

app.post("/:id/absent/:id_2", isLoggedIn, async (req, res) => {
  let { id, id_2 } = req.params;
  let stu = await List.findById(id);
  let subject = stu.subject;

  for (let sub of subject) {
    if (sub._id == id_2) {
      sub.totalDays = sub.totalDays + 1;
      await stu.save();
      break;
    }
  }

  res.redirect(`/${id}`);
});
