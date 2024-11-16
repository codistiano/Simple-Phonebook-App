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
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{1,3}-\d{6,8}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }, 
    minLength: 8,
  },
});

module.exports = mongoose.model("Person", personSchema);
