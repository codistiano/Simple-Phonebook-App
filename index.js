const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(morgan(":method :url :status - :response-time ms :body"))
app.use(express.static("dist"))

morgan.token("body", (req, res) => {
    return JSON.stringify(req.body);
})

const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.get("/info", (req, res) => {
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

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const contact = persons.find((person) => person.id === id);
  if (contact) {
    res.send(contact);
  } else {
    res.status(404).send("Contact not found");
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const index = persons.findIndex((person) => person.id === id);
  if (index === -1) {
    res.status(404).send("Contact not found");
  } else {
    persons.splice(index, 1);
    res.send(persons);
  }
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  const rndId = Math.random() * 94838493;
  const newContact = { id: rndId.toString(), name, number };
  const nameExists = persons.some((contact) => contact.name === name);
  if (!name || !number) {
    res.status(400).send({ error: "Name and number are required" });
    return;
  } else if (nameExists) {
    res.status(400).send({ error: "name must be unique" });
    return;
  }
  persons.push(newContact);
  res.send(newContact);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
