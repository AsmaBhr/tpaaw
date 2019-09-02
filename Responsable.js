const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Responsable = express.Router();
const responsable = require("../models/responsable");


const students = express.Router();
const Student = require("../models/student");

Responsable.use(cors());
students.use(cors());

process.env.SECRET_KEY = "l!F0t4Ch";


//use of async/await
students.post("/login", async (req, res) => {
  const student = await Student.findOne({
    matricule: req.body.matricule
  });
  if (student) {
    if (bcrypt.compareSync(req.body.password, student.password)) {
      const payload = {
        _id: student._id,
        firstname: student.firstname,
        lastname: student.lastname,
        matricule: student.matricule,
        password: student.password
      };
      let token = jwt.sign(payload, process.env.SECRET_KEY, {
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

module.exports = students;






