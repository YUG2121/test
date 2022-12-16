require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-Parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.set('strictQuery', false); mongoose.connect("mongodb://127.0.0.1:27017/UserDB");
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});



userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const user = new mongoose.model("user", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newuser = new user({
    email: req.body.username,
    password: req.body.password,
  });

  newuser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  user.findOne({ email: username }, function (err, founduser) {
    if (err) {
      console.log(err);
    } else {
      if (founduser) {
        if (founduser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, function () {
  console.log("server is live on port 3000");
});
