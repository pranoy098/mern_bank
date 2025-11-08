const mongo = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongo;

const brandingSchema = new Schema(
  {
    bankName: String,
    bankTagline: String,
    bankLogo: String,
    bankAccountNo: String,
    bankTransactionId: String,
    bankAddress: String,
    bankLinkedIn: String,
    bankTwitter: String,
    bankFacebook: String,
    bankDesc: String,
  },
  { timestamps: true }
);

module.exports = mongo.model("branding", brandingSchema);
