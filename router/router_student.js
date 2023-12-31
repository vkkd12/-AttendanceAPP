import express from "express";
const router = express.Router();
import student_controller from "../controller/student_controller.js";
import middleware from "../middleware.js";

router.get(
  "/:id",
  middleware.isLoggedIn,
  middleware.isOwner,
  student_controller.StudentPage
);

router.post(
  "/:id/present/:id_2",
  middleware.isLoggedIn,
  student_controller.Present
);

router.post(
  "/:id/absent/:id_2",
  middleware.isLoggedIn,
  student_controller.Absent
);

const router_student = router;
export default router_student;
