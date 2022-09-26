const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
var cors = require("cors");
const bodyParser = require("body-parser");
const user = require("./routes/user");
const post = require("./routes/post");

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
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", user);
app.use("/user", post);

app.listen(process.env.PORT || 4000, () => {
  console.log("Backend");
});
