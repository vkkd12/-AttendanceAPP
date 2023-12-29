function logic(attend_days, todayDays) {
  let res = (attend_days * 100.0) / todayDays;
  let leaveDays = Math.floor((4 / 3) * attend_days - todayDays);
  let noLeaves = Math.ceil(3 * todayDays - 4 * attend_days);
  return res >= 75 ? [true, leaveDays] : [false, noLeaves];
}

function searchStudentById(Listings, id) {
  for (let stu of Listings) {
    if (stu._id == id) return stu;
  }
}
const utils = { searchStudentById, logic };
export default utils;
