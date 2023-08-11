const express = require("express");
const cookieParser = require("cookie-parser");
const { render } = require("ejs");
const jwt = require('jsonwebtoken');
const os = require("os");
const dotenv = require("dotenv");

const app = express();
const router = express.Router();

app.use(cookieParser());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

dotenv.config();

const secret = process.env.JWT_SECRET;
const PORT = process.env.DASHIT_PORT;
const admin_password = process.env.ADMIN_PASSWORD;

app.get("/", (req, res) => {
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, secret);
    res.render("home");
  } catch (err) {
    console.error(err);
    res.redirect("/logIn");
  }
});


app.get("/logIn", (req, res) => {
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, secret);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("logIn");
  }
});


app.post("/logIn", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  console.log(`PWD:  ${admin_password}`);
  if (username === "admin" && password === admin_password) {
    const payload = { username }; // or any other user information you want to include
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    res.cookie("token", token, {
      maxAge: 60 * 60 * 1000, // cookie will expire in 1 hour
      httpOnly: true, // cookie not accessible from client-side scripts
      secure: true, // cookie only transmitted over HTTPS
    });
    res.redirect("/");
  } else {
    let wrongCredential = true;
    res.render("logIn", {wrongCredential});
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

const api = require("./routes/api");  


app.use("/api", api);
app.listen(PORT, () => console.log(`App listening on ${PORT}`));