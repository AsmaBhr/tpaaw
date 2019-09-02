const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;
const mongoUrl = "mongodb://localhost:27017/notedb";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
//protected routes

//admin protected route
const  Admin = require("./routes/admin") 
app.use('/administration', Admin);

//admin login & register
const Login = require("./routes/login")
app.use('/admin', Login)

//professor route
const professors = require("./routes/professor");
app.use("/professors", professors);
//professor protected route
const  ProtectedProfessor = require("./routes/protected-professor") 
app.use('/api/professor', ProtectedProfessor);

//student routes
const students = require("./routes/students");
app.use("/students", students);
//student protected route
const  ProtectedStudent = require("./routes/protected-student") 
app.use('/api/student', ProtectedStudent);


//responsable routes
const students = require("./routes/Responsable");
app.use("/Responsable", Respponsable);
//responsable protected route
const  ProtectedStudent = require("./routes/protected-responsable") 
app.use('/api/responsables', ProtectedResponsable);

// Connect to the db
mongoose.connect(
  mongoUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async (err, db) => {
    if (err) throw err;

    await console.log("connected to mongodb");
  }
);

//start the server
app.listen(PORT, () => {
  console.log("Server started on port: " + PORT);
});
