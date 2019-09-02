const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const Professor = require("../models/professor");
const Responsable = require("../models/responsable");


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
// Create new admin #delete or comment the function after the creation !

// Create new responsable
ProtectedRoutes.post("/responsables", async (req, res) => {
  const today = new Date();
  const modules = req.body.modules.split(","); //TODO: check if modules exist
  const professorData = {
    matricule: req.body.matricule,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    modules: modules,
    created: today
  };

  Professor.findOne({
    matricule: req.body.matricule
  })
    .then(Responsable => {
      if (!Responsable) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          professorData.password = hash;
          Responsable.create(responsableData)
            .then(Responsable => {
              res.json({
                status: Responsable.matricule + " registred"
              });
            })
            .catch(err => {
              res.send("Error: " + err);
            });
        });
      } else {
        res.json({ error: "Responsable already exists" });
      }
    })
    .catch(err => {
      res.send("Error: " + err);
    });
});
// Create new professor
ProtectedRoutes.post("/professors", async (req, res) => {
  const today = new Date();
  const modules = req.body.modules.split(","); //TODO: check if modules exist
  const professorData = {
    matricule: req.body.matricule,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    modules: modules,
    created: today
  };

  Professor.findOne({
    matricule: req.body.matricule
  })
    .then(professor => {
      if (!professor) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          professorData.password = hash;
          Professor.create(professorData)
            .then(professor => {
              res.json({
                status: professor.matricule + " registred"
              });
            })
            .catch(err => {
              res.send("Error: " + err);
            });
        });
      } else {
        res.json({ error: "Professor already exists" });
      }
    })
    .catch(err => {
      res.send("Error: " + err);
    });
});

//
ProtectedRoutes.get("/marks", async (req, res) => {
  const studentData = req.authData;
  const student = await Student.find(
    { matricule: studentData.matricule },
    "matricule notes"
  );
  res.send(student);
});

//Consulter note par matiere
ProtectedRoutes.get("/marks/:module", async (req, res) => {
  const studentData = req.authData;
  const module = req.params.module; //TODO: check if not null and is a valid module
  const student = await Student.find(
    { matricule: studentData.matricule },
    { notes: { $elemMatch: { module } } }
  );
  res.send(student);
});

module.exports = ProtectedRoutes;
