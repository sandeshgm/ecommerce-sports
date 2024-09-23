const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  signUp,
  signIn,
  logOut,
} = require("../controllers/authControllers/auth.controllers");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "userImage/");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.mimetype.split("/")[1];
    cb(null, Date.now() + "." + fileExtension);
  },
});

const upload = multer({ storage: storage });

router.post("/sign-up", upload.single("image"), signUp);
router.post("/sign-in", signIn);
router.post("/logout", logOut);

module.exports = router;
