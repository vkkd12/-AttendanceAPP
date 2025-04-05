import List from "../model/studentSchema.js";
import user from "../model/user.js";
import utils from "../utils/helper.js";
const { logic } = utils;

const StudentPage = async (req, res) => {
  let { id } = req.params;
  let student = await List.findById(id);
  if (student === undefined) {
    res.redirect("/addStudent");
  } else {
    for (let sub of student.subject) {
      let arr = logic(sub.attend_days, sub.totalDays);
      sub.canBeAbsent = arr[0];
      sub.lectures = arr[1];
    }
    res.render("student/student.ejs", { student });
  }
};

const Present = async (req, res) => {
  let { id, id_2 } = req.params;
  let stu = await List.findById(id);
  let subject = stu.subject;

  for (let sub of subject) {
    if (sub._id == id_2) {
      sub.LastChange = new Date();
      sub.totalDays = sub.totalDays + 1;
      sub.attend_days = sub.attend_days + 1;
      await stu.save();
      break;
    }
  }
  res.redirect(`/sent/${id}`);
};

const removePresent = async (req, res) => {
  let { id, id_2 } = req.params;
  let stu = await List.findById(id);
  let subject = stu.subject;

  for (let sub of subject) {
    if (sub._id == id_2) {
      sub.totalDays = sub.totalDays - 1;
      sub.attend_days = sub.attend_days - 1;
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
      sub.LastChange = new Date();
      sub.totalDays = sub.totalDays + 1;
      await stu.save();
      break;
    }
  }
  res.redirect(`/sent/${id}`);
};

const removeAbsent = async (req, res) => {
  let { id, id_2 } = req.params;
  let stu = await List.findById(id);
  let subject = stu.subject;

  for (let sub of subject) {
    if (sub._id == id_2) {
      sub.totalDays = sub.totalDays - 1;
      await stu.save();
      break;
    }
  }
  res.redirect(`/sent/${id}`);
};

const EditPage = async (req, res) => {
  let { id } = req.params;
  let student = await List.findById(id);
  res.render("student/edit.ejs", { student });
};

const SaveEditPage = async (req, res) => {
  let { id } = req.params;
  let stu = await List.findById(id);
  for (let sub of stu.subject) {
    let newDetails = req.body[sub._id];
    sub.name = newDetails._name;
    sub.totalDays = newDetails._TotalDays;
    sub.attend_days = newDetails._AttendDays;
  }

  let subject = stu.subject;
  for (let i = 1; true; i++) {
    let value = `newSubject${i}`;
    let sub = req.body[value];
    if (sub) {
      let temp = {
        name: sub._name,
        totalDays: sub._TotalDays,
        attend_days: sub._AttendDays,
      };
      subject.push(temp);
    } else {
      break;
    }
  }

  stu.subject = subject;
  await stu.save();

  res.redirect(`/sent/${id}`);
};

const Delete = async (req, res) => {
  let { id, id_2 } = req.params;
  let stu = await List.findById(id);
  let newSubjects = stu.subject.filter((sub) => {
    if (sub._id != id_2) return sub;
  });
  stu.subject = newSubjects;
  await stu.save();
  res.redirect(`/sent/${id}`);
};

const DeleteAll = async (req, res) => {
  let curr_USER = await user.findById(req.user._id);
  await List.findByIdAndDelete(curr_USER.student);
  curr_USER.student = undefined;
  await curr_USER.save();
  res.redirect(`/login`);
};

const student_controller = {
  StudentPage,
  Present,
  removePresent,
  Absent,
  removeAbsent,
  EditPage,
  SaveEditPage,
  Delete,
  DeleteAll,
};
export default student_controller;
