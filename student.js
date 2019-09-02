const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const ObjectId = Schema.ObjectId;

const StudentSchema = new Schema({
  matricule: String,
  firstname: String,
  lastname: String,
  password: String,

  modules: [
    {
      module: String,
      note: Number,
      pv: String
    }
  ],
  PV_final: {
    Moyenne: Number,
    Remarque: String,
    Reclamation: String
  },
  created: String
});

module.exports = Student = mongoose.model("students", StudentSchema);
