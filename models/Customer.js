var  mongoose = require("mongoose");
var  Schema = mongoose.Schema;

var  userCustomerSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
          },
        phoneNumber: {
            type:  Number,
            unique:  true,
            required:  true
        },
        password: {
            type: String,
            required: true,
            min: 6,
          },
          otp: {
            type: Number,
          },
          otpExpiresAt: {
            type: Number,
          },
    },
    { timestamps:  true }
);

module.exports = mongoose.model("Customerdetails", userCustomerSchema);