const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.json({ message: "welcome to our upload module apis" });
  // res.render('index', { title: 'Express' });
  // res.send("index3.html");
});

module.exports = router;
