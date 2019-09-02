const express = require("express");
const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const Professor = require("../models/professor");

const ProtectedRoutes = express.Router();
ProtectedRoutes.use((req, res, next) => {
  // check header for the token
  var token = req.headers["access-token"];

  // decode token
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(token, process.env.PROF_SECRET_KEY, (err, authData) => {
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

// Prof get his module's notes
ProtectedRoutes.get("/notes/:module", async (req, res) => {
  const avalableModules = await Professor.find(
    { matricule: req.authData.matricule },
    { _id: 0, modules: 1 }
  );
  const modulesArray = avalableModules.map(x => x.modules);
  const modules = modulesArray[0];

  if (modules.includes(req.params.module)) {
    console.log(req.params.module.toUpperCase());
    const studentsNotes = await Student.find(
      { "modules.module": req.params.module.toUpperCase() },
      {
        firstname: 1,
        lastname: 1,
        modules: { $elemMatch: { module: req.params.module.toUpperCase() } }
      }
    );
    res.send(studentsNotes);
  } else {
    res
      .status(403)
      .send({ error: "You dont have permission to see this module" });
  }
});
// Prof set his module's notes
ProtectedRoutes.put("/notes", async (req, res) => {
  //Get available modules
  const avalableModules = await Professor.find(
    { matricule: req.authData.matricule },
    { _id: 0, modules: 1 }
  );
  const modulesArray = avalableModules.map(x => x.modules);
  const modules = modulesArray[0]; //extract the module's string from the array
  //
  if (modules.includes(req.body.module)) {
    const updatedNotes = await Student.updateOne(
      {
        matricule: req.body.studentMatricule,
        "modules.module": req.body.module.toUpperCase()
      },
      { $set: { "modules.$.note": req.body.note } } //check if valide note >=0 <=20
    );
    const moy = moyenne(req.body.studentMatricule);
    res.send({updatedNotes: updatedNotes});
  } else {
    res
      .status(403)
      .send({ error: "You dont have permission to edit this module" });
  }
});
async function moyenne(matricule){
  const coof = [5, 6, 3, 5, 2, 2, 5, 6];
  const modulesNotes = await Student.find(
    { matricule: matricule },
    { _id: 0, modules: 1 }
  );
  
  const modulesArray = modulesNotes.map(x => x.modules);
  const modules = modulesArray[0]; //extract the module's string from the array
  
  const notesArray = modules.map(x => x.note);
  
  const sum_products = notesArray.reduce( 
    (sum, val, i) => sum + val * coof[i],
    0
  );
  //calculate average
  const moy = (sum_products / coof.reduce((sum, x) => sum + x));
  //res.send({ sum: sum_products, moy, fixed: parseFloat(moy.toFixed(2)) });
  const updateMoyenne = await Student.updateOne(
    {
      matricule: matricule
     
    },
    { $set: { "PV_final.Moyenne": parseFloat(moy.toFixed(2)) } } 
  );

};

module.exports = ProtectedRoutes;
