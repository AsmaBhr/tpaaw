const express = require("express");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");

const admins = express.Router();
process.env.ADMIN_SECRET_KEY = "@/d12Vz!ttMCc*!78";
admins.post("/register", async (req, res) => {
    Admin.countDocuments({}, function(err, count){
        console.log( "Number of docs: ", count );
        if(count == 0) {
            const today = new Date();
  const adminData = {
    matricule: req.body.matricule,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: "",
    created: today
  };
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    adminData.password = hash;
    Admin.create(adminData)
      .then(admin => {
        res.json({
          status: admin.matricule + " registred"
        });
      })
      .catch(err => {
        res.send("Error: " + err);
      });
  });
        } else 
        res.status(403).send({ error: "Can't create more admins" });
    });

});

//Admin login
admins.post("/login", async (req, res) => {
  const admin = await Admin.findOne({
    matricule: req.body.matricule
  });
  if (admin) {
    if (bcrypt.compareSync(req.body.password, admin.password)) {
      const payload = {
        _id: admin._id,
        firstname: admin.firstname,
        lastname: admin.lastname,
        matricule: admin.matricule,
        password: admin.password
      };
      let token = jwt.sign(payload, process.env.ADMIN_SECRET_KEY, {
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

module.exports = admins;