const mongoose = require("mongoose");
const MarksSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Data",
  },
  subject: String,
  marks: Number,
});

module.exports = {
    MarksSchema,
}