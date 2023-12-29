import { connect } from "mongoose";
import data from "./data.js";
import List from "../model/studentSchema.js";
import user from "../model/user.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/Attendance";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await connect(MONGO_URL);
}

const initDB = async () => {
  // await List.deleteMany({});
  //   List.insertMany(data)
  //     .then(() => console.log("data was initialized"))
  //     .catch((err) => console.log(err));
  let users = await user.find();
  users[2].student = "658f04eae1273ed5b1011f76";
  await users[2].save();
  console.log(users);
};

initDB();
