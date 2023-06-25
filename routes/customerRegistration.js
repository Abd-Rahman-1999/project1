const router = require("express").Router();
const User = require("../models/Customer");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


//REGISTER
router.post("/customer-portal", async (req, res) => {
  const {username,email,phoneNumber,password} = req.body; 
  try {
    const userFromDb = await User.findOne({ phoneNumber: phoneNumber });
    if(userFromDb){
      res.status(400).send({msg:"User Already Exist"})
    }else{

          //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      username: username,
      email: email,
      phoneNumber: phoneNumber,
      password: hashedPassword,
      otp : "",
      otpExpiresAt : ""
    });

        //save user and respond
        const user = await newUser.save();
        res.status(200).json({msg:"Registered Successfully",user : user});

    }
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;