const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const professors = express.Router();
const Professor = require("../models/professor");

professors.use(cors());

process.env.PROF_SECRET_KEY = "B6!@iH4_Uw";



//use of async/await
professors.post("/login", async (req, res) => {
  const professor = await Professor.findOne({
    matricule: req.body.matricule
  });
  if (professor) {
    if (bcrypt.compareSync(req.body.password, professor.password)) {
      const payload = {
        _id: professor._id,
        firstname: professor.firstname,
        lastname: professor.lastname,
        matricule: professor.matricule,
        password: professor.password
      };
      let token = jwt.sign(payload, process.env.PROF_SECRET_KEY, {
        expiresIn: 1440
      });
      res.send(token);
    } else {
      res.json({ error: "Username or password incorrect " });
    }
  } else {
    res.json({ error: "Username or password incorrect " });
  }
});

module.exports = professors;
