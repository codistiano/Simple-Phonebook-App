const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

mongoose
  .connect(url)
  .then((res) => {
    console.log("Connected to the Database");
  })
  .catch((err) => {
    console.log("Database Connection Error: ", err);
  });

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

module.exports = mongoose.model("Person", personSchema);
