import express from "express";
const router = express.Router();
import user_controller from "../controller/user_controller.js";
import middleware from "../middleware.js";
import passport from "passport";

router.get("/", middleware.isLoggedIn, user_controller.Home);

router
  .route("/login")
  .get(user_controller.LoginPage)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    user_controller.LoginDone
  );

router
  .route("/register")
  .get(user_controller.RegisterPage)
  .post(user_controller.RegisterDone);

router
  .route("/addStudent")
  .get(middleware.isLoggedIn, user_controller.AddStudentPage)
  .post(middleware.isLoggedIn, user_controller.AddStudentDone);

router.get("/logout", user_controller.LogoutDone);

const router_user = router;
export default router_user;
