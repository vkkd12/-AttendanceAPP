import mongoose from "mongoose";
const { Schema, model } = mongoose;

const StudentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  subject: [
    {
      name: String,
      totalDays: Number,
      attend_days: Number,
      canBeAbsent: Boolean,
      lectures: Number,
      LastChange: {
        type: Date,
        default: new Date(),
      }
    },
  ],
});

const List = model("List", StudentSchema);
export default List;
