const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
      },
      lastName: {
        type: String,
        required: true,
      },
      emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Invalid email address: " + value);
          }
        },
      },
      password: {
        type: String,
        required: true,
        validate(value) {
          if (!validator.isStrongPassword(value)) {
            throw new Error("Enter a Strong Password: " + value);
          }
        },
      },
      age: {
        type: Number,
        min: 18,
      },
      gender: {
        type: String,
        enum: {
          values: ["male", "female", "other"],
          message: `{VALUE} is not a valid gender type`,
        },
        // validate(value) {
        //   if (!["male", "female", "others"].includes(value)) {
        //     throw new Error("Gender data is not valid");
        //   }
        // },
      },
      isPremium: {
        type: Boolean,
        default: false,
      },
      membershipType: {
        type: String,
      },
      photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        validate(value) {
          if (!validator.isURL(value)) {
            throw new Error("Invalid Photo URL: " + value);
          }
        },
      },
      about: {
        type: String,
        default: "This is a default about of the user!",
      },
      skills: {
        type: [String],
      },
    },
    {
      timestamps: true,
    }
  );

userSchema.methods.getJWT = async function () {
    const user = this;
  
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
      expiresIn: "7d",
    });
  
    return token;
  };


module.exports = mongoose.model("User", userSchema);

