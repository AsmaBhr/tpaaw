const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const ObjectId = Schema.ObjectId;

const AdminSchema = new Schema({
 
  matricule: String,
  firstname: String,
  lastname: String,
  password: String,
  created: String
});

module.exports = Admin = mongoose.model('admins', AdminSchema);