const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const Responsable = require("../models/responsable");
const Student= require("../models/student");

const ProtectedRoutes = express.Router();
ProtectedRoutes.use((req, res, next) => {
  // check header for the token
  var token = req.headers["access-token"];

  // decode token
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token, process.env.ADMIN_SECRET_KEY, (err, authData) => {
      if (err) {
        return res.json({ message: "invalid token" });
      } else {
        // if everything is good, save to request for use in other routes
        req.authData = authData;
        next();
      }
    });
  } else {
    // if there is no token

    res.send({
      message: "No token provided."
    });
  }
});


//create new student
students.post("/register", (req, res) => {
  const today = new Date();
  const studentData = {
    matricule: req.body.matricule,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: '',
    modules: [
      { module: "AAW", note: "", pv: "" },
      { module: "MSSC", note: "", pv: "" },
      { module: "SRI", note: "", pv: "" },
      { module: "IGR", note: "", pv: "" },
      { module: "MTS", note: "", pv: "" },
      { module: "ANGLAIS", note: "", pv: "" },
      { module: "GCC", note: "", pv: "" },
      { module: "CSE", note: "", pv: "" }
    ],
    PV_final: {
      Moyenne: "",
      Remarque: "",
      Reclamation: ""
    },
    created: today
  };

  Student.findOne({
    matricule: req.body.matricule
  })
    .then(student => {
      if (!student) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          studentData.password = hash;
          Student.create(studentData)
            .then(student => {
              res.json({
                status: student.matricule + " registred"
              });
            })
            .catch(err => {
              res.send("Error: " + err);
            });
        });
      } else {
        res.json({ error: "Student already exists" });
      }
    })
    .catch(err => {
      res.send("Error: " + err);
    });
});
// Create new responsable #delete or comment the function after the creation !

s
  
  //delete a student par matricule
  ProtectedRoutes.delete('/students/:matricule', async (req, res) => {
    const studentData = req.authData;
    const matricule = req.params.matricule;
    const student = await Student.find(
      { matricule: studentData.matricule },
      "matricule student"
    );
    res.send(student);
  });
  
  //modify a student
  ProtectedRoutes.put('/students/:matricule', async (req, res) => {
    const studentData = req.authData;
    const matricule = req.params.matricule;
    const student = await Student.find(
      { matricule: studentData.matricule },
      "matricule student"
    );
    res.send(student);
  });
  //consult student complaints (regarding the minutes of deliberation)
  ProtectedRoutes.put("/pv/:module", async (req, res) => {
    const studentData = req.authData;
    const module = req.params.module; //TODO: check if not null and is a valid module
    const student = await Student.find(
      { matricule: studentData.matricule },
      { notes: { $elemMatch: { module } } }
    );
    res.send(student);
  });
  
  
  //il affiche le PV de délibération finale
  ProtectedRoutes.get("/marks", async (req, res) => {
    const studentData = req.authData;
    const student = await Student.find(
      { matricule: studentData.matricule },
      "matricule modules PV_final"
    );
    res.send(student);
  });
  
  
  module.exports = ProtectedRoutes;
  