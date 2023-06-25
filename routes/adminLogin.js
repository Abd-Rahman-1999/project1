const router = require("express").Router();
const User = require("../models/AdminUser");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


// Generate a random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  
  // Send OTP via email
  async function sendOTP(email, otp) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for login",
      text: `Your OTP is: ${otp}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email Sent Successfully");
    } catch (error) {
      console.log("Error sending email:", error);
    }
  }



  // Login with OTP
router.post("/admin-portal", async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const otp = generateOTP();
  
      user.otp = otp;
      user.otpExpiresAt = Date.now() + 2 * 60 * 1000; // OTP expires in 2 minutes
      await user.save();
      console.log(user)
  
      // Send OTP to user's email
      sendOTP(email, otp);
  
      res.json({ message: "OTP sent to your email" });
    } catch (error) {
      console.log("Error during login:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  
  // Verify OTP
  router.post("/verify-admin-portal", async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if OTP has expired
      if (user.otpExpiresAt && user.otpExpiresAt < Date.now()) {
        return res.status(400).json({ error: "OTP has expired" });
      }
  
      // Check if OTP matches
      if (user.otp === otp) {
        // If OTP matches clear OTP and OTP expiration time
        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
              $set: {
                otp : undefined,
                otpExpiresAt: undefined
              },
            },
            {returnDocument:"after"}
          );
      
          if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
          }
  
        // Generate and send JWT token for authentication
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        return res.json({ token : token, user : user });
      } else {
        return res.status(400).json({ error: "Invalid OTP" });
      }
    } catch (error) {
      console.log("Error during OTP verification:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


module.exports = router;