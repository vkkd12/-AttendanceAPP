import List from "../model/studentSchema.js";
import user from "../model/user.js";

const Home = async (req, res) => {
  res.redirect("/login");
};

const LoginPage = async (req, res) => {
  res.render("student/login.ejs");
};

const LoginDone = async (req, res) => {
  if (req.user.student === undefined) {
    req.flash("success", "Complete your registeration!!");
    res.redirect("/addStudent");
  } else {
    req.flash("success", "Welcome Back To Fairy Tail");
    let id = req.user.student._id;
    res.redirect(`/sent/${id}`);
  }
};

const RegisterPage = async (req, res) => {
  res.render("student/register.ejs");
};

const RegisterDone = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let user_already_exists = await user.findOne({ username });
    if (user_already_exists) {
      res.redirect("/login");
    } else {
      let user_login = new user({ username, email });
      let registered_user = await user.register(user_login, password);
      req.login(registered_user, (err) => {
        if (err) next(err);
        res.redirect("/addStudent");
      });
    }
  } catch (error) {
    res.redirect("/register");
  }
};

const AddStudentPage = async (req, res) => {
  res.render("student/addStudent.ejs");
};

const AddStudentDone = async (req, res) => {
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
    adding_student_with_user.student = stu._id;
    await adding_student_with_user.save();

    res.redirect(`/sent/${stu._id}`);
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
};

const LogoutDone = (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    res.redirect("/login");
  });
};

const user_controller = {
  Home,
  LoginDone,
  LoginPage,
  RegisterPage,
  RegisterDone,
  AddStudentPage,
  AddStudentDone,
  LogoutDone,
};
export default user_controller;
