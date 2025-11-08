const mongo = require("mongoose");
const { Schema } = mongo;

const branchSchema = new Schema(
  {
    branchName: {
      type: String,
      unique: true,
    },
    key: String,
    branchAddress: String,
  },
  { timestamps: true }
);

module.exports = mongo.model("branch", branchSchema);
