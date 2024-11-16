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

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id).then((contact) => {
    if (contact) {
      res.send(contact);
    } else {
      res.status(404).send("Contact not found");
    }
  }).catch(error => next(error))
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;

  const newNumber = {
    phone: req.body.phone
  }

  Person.findByIdAndUpdate(id, newNumber, {new: true})
  .then(updatedPerson => {
    res.json(updatedPerson)
  }).catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  
  Person.findByIdAndDelete(id)
    .then((deletedPerson) => {
      if (!deletedPerson) {
        return res.status(404).send("Contact not found");
      }
      res.send(deletedPerson)
    })
    .catch(error => next(error))
});

app.post("/api/persons", (req, res, next) => {
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
        .catch(error => next(error))
    })
    .catch((error) => {
      res.status(500).send({ error: "Failed to retrieve contacts" });
    });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
