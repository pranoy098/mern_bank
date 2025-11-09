const mongo = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongo;

const userSchema = new Schema(
  {
    fullname: String,
    mobile: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    profile: String,
    key: String,
    address: String,
    branch: String,
    userType: String,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

module.exports = mongo.model("users", userSchema);
