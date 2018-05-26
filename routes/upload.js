const express = require("express");
const router = express.Router();

const path = require("path");
const multer = require("multer");
// const multerupload = multer({ dest: path.join(global.dir, "uploads") });
// path.join(global.dir, "uploads", filename)
const { process2 } = require("../db/db");

router.get("/", function(req, res, next) {
  res.json({ message: "welcome to our upload module apis" });
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // debugger;
    cb(null, path.join(global.dir, "uploads"));
  },
  filename(req, file, cb) {
    // debugger;

    const f = file.originalname;
    const name = f.split(".").shift();
    const suffix = f.replace(/^.*\./, "");
    const svfile = name + "." + Date.now() + "." + suffix;

    cb(null, svfile);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("ufile"), function(req, res, next) {
  //   debugger;
  if (req.file) {
    // debugger;
    // res.send(JSON.parse(process.env.ggl));
    process2(req.file.filename, req.body.batch); // process file
  }

  res.redirect("/");
});

module.exports = router;
