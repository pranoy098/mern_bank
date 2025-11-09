const mongo = require("mongoose");
const { Schema } = mongo;

const currencySchema = new Schema(
  {
    currencyName: {
      type: String,
      unique: true,
    },
    key: String,
    currencyDesc: String,
  },
  { timestamps: true }
);

module.exports = mongo.model("currency", currencySchema);
