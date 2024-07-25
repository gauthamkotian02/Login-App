const customerSchema = require("../Models/customer_schema");

const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const SECRETE_KEY = "PRODUCTS";
const mongoose = require("mongoose");

const Register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const profile = req.file?.filename;
    let checkEmail = await customerSchema.findOne({ email: email });
    if (checkEmail) {
      console.log("Email already exists!");
      res.json({ message: "Email already exists!" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      let newcustomer = await new customerSchema({
        name,
        phone,
        email,
        password: hashedPassword,
        profile,
      });
      let savedcustomer = await newcustomer.save();
      console.log("New customer registered successfully");
      res.json({
        success: true,
        message: "New customer registered successfully",
        customer: savedcustomer,
      });
    }
  } catch (err) {
    console.log("Error" + err);
    res.json({ error: err, message: "error" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await customerSchema.findOne({ email: email });
    if (!user) {
      console.log("Email not found!");
      res.json({ message: "Email or Password Invalid!" });
    } else {
      let checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        console.log("Invalid Password!");
        res.json({ message: "Email or Password Invalid!" });
      } else {
        let userId = user.id;
        let token = await jsonwebtoken.sign(userId, SECRETE_KEY);
        console.log("Login successful!");
        res.json({
          message: "Login successful!",
          success: true,
          loggedInUser: user,
          authToken: token,
        });
      }
    }
  } catch (err) {
    console.log("Error occurred" + err);
    res.json({ error: err });
  }
};

module.exports = {
  Register,
  Login,
};
