const mongo = require("mongoose");
const { Schema } = mongo;

const transactionSchema = new Schema(
  {
    transactionType: String,
    transactionAmount: String,
    reference: String,
    currentBalance: Number,
    accountNo: Number,
    key: String,
    customerId: String,
  },
  { timestamps: true }
);
module.exports = mongo.model("transaction", transactionSchema);
