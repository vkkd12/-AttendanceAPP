import List from "../model/studentSchema.js";
import utils from "../utils/helper.js";
const { logic } = utils;

const StudentPage = async (req, res) => {
  let { id } = req.params;
  let student = await List.findById(id);

  for (let sub of student.subject) {
    let arr = logic(sub.attend_days, sub.totalDays);
    sub.canBeAbsent = arr[0];
    sub.lectures = arr[1];
  }
  res.render("student/student.ejs", { student });
};

const Present = async (req, res) => {
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
  res.redirect(`/sent/${id}`);
};

const Absent = async (req, res) => {
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
  res.redirect(`/sent/${id}`);
};

const student_controller = { StudentPage, Present, Absent };
export default student_controller;
