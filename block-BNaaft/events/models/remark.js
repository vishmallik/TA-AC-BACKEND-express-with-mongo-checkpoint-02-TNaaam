const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const remarkSchema = new Schema({
  title: String,
  author: String,
  likes: { type: Number, default: 0 },
  eventId: { type: Schema.Types.ObjectId, ref: "Event" },
});

module.exports = mongoose.model("Remark", remarkSchema);
