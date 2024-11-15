const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const Person = require("./models/person");

app.use(express.json());
app.use(morgan(":method :url :status - :response-time ms :body"));
app.use(express.static("dist"));

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(persons);
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    const usersAmount = persons.length;
    const serverTime = new Date();
    res.send(
      "<p>Phonebook has info for " +
        usersAmount +
        " people</p><p>" +
        serverTime +
        "</p>"
    );
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(id).then((contact) => {
    if (contact) {
      res.send(contact);
    } else {
      res.status(404).send("Contact not found");
    }
  })
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  
  Person.findByIdAndDelete(id)
    .then((deletedPerson) => {
      if (!deletedPerson) {
        return res.status(404).send("Contact not found");
      }

      Person.find({}).then((persons) => {
        res.send(persons); 
      });
    })
    .catch((error) => {
      console.error("Error deleting person:", error);
      res.status(500).send("Error deleting contact");
    });
});

app.post("/api/persons", (req, res) => {
  const { name, phone } = req.body;
  
  if (!name || !phone) {
    res.status(400).send({ error: "Name and phone are required" });
    return;
  }

  const newContact = new Person({ name, phone });

  Person.find({})
    .then((persons) => {
      const nameExists = persons.some((contact) => contact.name === name);
      
      if (nameExists) {
        res.status(400).send({ error: "name must be unique" });
        return;
      }

      newContact.save()
        .then((savedContact) => {
          res.send(savedContact);
        })
        .catch((error) => {
          res.status(500).send({ error: "Failed to save contact" });
        });
    })
    .catch((error) => {
      res.status(500).send({ error: "Failed to retrieve contacts" });
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
