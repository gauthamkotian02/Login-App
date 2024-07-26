const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  Register,
  Login,
 
} = require("../controller/Customer");
const fetchCustomer = require("../middleware/Customer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/customer/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post("/Register", upload.single("profile"), Register);
router.post("/login", Login);



module.exports = router;
