const mongoose = require("mongoose");

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

const conn = mongoose.connection;
conn.on("error", () => console.error.bind(console, "connection error"));
conn.once("open", () => console.info("Connection to Database is successfulll"));

module.exports = conn;
