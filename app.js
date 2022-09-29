const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
var cors = require("cors");
const bodyParser = require("body-parser");
const user = require("./routes/user");
const post = require("./routes/post");
const path = require("path");
const redis = require("redis");

const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DBConnection Sufccessful");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());
const __dirName = path.resolve();
app.use("/images", express.static(path.join(__dirName, "/images")));
app.use("/videos", express.static(path.join(__dirName, "/videos")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/auth", user);
app.use("/user", post);

exports.client = redis.createClient(6379);
app.listen(process.env.PORT || 4000, () => {
  console.log("Backend");
});
