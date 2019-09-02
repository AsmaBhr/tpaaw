const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Student = require("../models/student");

const ProtectedRoutes = express.Router();
ProtectedRoutes.use((req, res, next) => {
  // check header for the token
  var token = req.headers["access-token"];

  // decode token
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token, process.env.SECRET_KEY, (err, authData) => {
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

ProtectedRoutes.get("/marks", async (req, res) => {
  const studentData = req.authData;
  const student = await Student.find(
    { matricule: studentData.matricule },
    "matricule modules PV_final"
  );
  res.send(student);
});

//Consulter note par matiere
ProtectedRoutes.get("/marks/:module", async (req, res) => {
  const studentData = req.authData;
  const module = req.params.module; //TODO: check if not null and is a valid module
  const student = await Student.find(
    { matricule: studentData.matricule },
    { modules: { $elemMatch: { module } } }
  );
  res.send(student);
});

//Déposer une reclamation pour une matiere
ProtectedRoutes.post("/pv/:module", async (req, res) => {
  const studentData = req.authData; // Get student info from the token
  const module = req.params.module.toUpperCase(); //TODO: check if not null and is a valid module
  const updatedNotePV = await Student.updateOne(
    { matricule: studentData.matricule, "modules.module": module },
    { $set: { "modules.$.pv": req.body.pv } } 
  );
  res.send(updatedNotePV);
});

module.exports = ProtectedRoutes;
