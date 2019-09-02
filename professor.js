const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ProfessorSchema = new Schema({
  matricule: String,
  firstname: String,
  lastname: String,
  password: String,
  modules: [String],
  created: String
});

module.exports = Professor = mongoose.model('professors', ProfessorSchema);