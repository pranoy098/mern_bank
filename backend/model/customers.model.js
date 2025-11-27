const mongo = require("mongoose");
const { Schema } = mongo;
const customerSchema = new Schema(
  {
    accountNo: Number,
    fullname: String,
    mobile: String,
    fatherName: String,
    email: {
      type: String,
      unique: true,
    },
    dob: String,
    gender: String,
    currency: String,
    key: String,
    profile: String,
    signature: String,
    document: String,
    finalBalance: {
      type: Number,
      default: 0,
    },
    address: String,
    userType: String,
    branch: String,
    createdBy: String,
    customerLoginId: String,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongo.model("customer", customerSchema);
