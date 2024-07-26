const customerSchema = require("../Models/customer_schema");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const env = require("dotenv");
env.config();
const SECRETE_KEY = process.env.TOKEN_SECRET; // Make sure to use a secure and environment-specific secret key

const Register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const profile = req.file?.filename;

    let checkEmail = await customerSchema.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let newCustomer = new customerSchema({
      name,
      phone,
      email,
      password: hashedPassword,
      profile,
    });

    let savedCustomer = await newCustomer.save();
    console.log("New customer registered successfully");
    res.status(201).json({
      success: true,
      message: "New customer registered successfully",
      customer: savedCustomer,
    });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: err, message: "Internal Server Error" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await customerSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email or Password Invalid!" });
    }

    let checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Email or Password Invalid!" });
    }

    let token = jsonwebtoken.sign({ userId: user.id }, SECRETE_KEY, {
      expiresIn: "1h",
    });
    console.log("Login successful!");
    res.json({
      message: "Login successful!",
      success: true,
      loggedInUser: user,
      authToken: token,
    });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: err, message: "Internal Server Error" });
  }
};

const Otp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const generateOtp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP

    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "a1343a57c05e3c",
        pass: "8d63aa95f8c397", // Replace with your Mailtrap password
      },
    });

    const info = await transporter.sendMail({
      from: "gauthamkotian020@gmail.com", // sender address
      to: email, // list of receivers
      subject: "New OTP Generated", // Subject line
      html: `<b>OTP is: <i>${generateOtp}</i></b>`, // HTML body
    });

    if (info.messageId) {
      let user = await customerSchema.findOneAndUpdate(
        { email },
        { otp: generateOtp },
        { new: true }
      );

      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }

      return res
        .status(200)
        .json({ message: "OTP Sent Successfully", success: true });
    }

    return res.status(500).json({ message: "Failed to send OTP" });
  } catch (err) {
    console.log("Error occurred: " + err);
    res.status(500).json({ error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate request payload
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required!" });
    }

    // Find user with matching email and OTP
    let user = await customerSchema.findOne({ email, otp });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    // Clear OTP after successful verification
    user.otp = 0;
    await user.save();

    // Generate JWT token
    let token = jsonwebtoken.sign({ userId: user.id }, SECRETE_KEY, {
      expiresIn: "1h",
    });

    res.json({
      message: "OTP verification successful and login complete!",
      success: true,
      loggedInUser: user,
      authToken: token,
    });
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(500)
      .json({ error: err.message, message: "Internal Server Error" });
  }
};

module.exports = {
  Register,
  Login,
  Otp,
  verifyOtp,
};
