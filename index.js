const express = require("express");
const cookieParser = require("cookie-parser");
const { render } = require("ejs");
const jwt = require('jsonwebtoken');
const os = require("os");

const app = express();
const router = express.Router();

app.use(cookieParser());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const token = req.cookies.token;
  const secret = process.env.JWT_SECRET; // or any other method to retrieve the secret
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
  const secret = process.env.JWT_SECRET; // or any other method to retrieve the secret
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
  console.log(`USER:  ${process.env.ADMIN_USER}`);
  console.log(`PWD:  ${process.env.ADMIN_PASSWORD}`);
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
    const payload = { username }; // or any other user information you want to include
    const secret = process.env.JWT_SECRET; // or any other method to retrieve the secret
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

app.listen(2500, () => console.log("app listening on 2500"));