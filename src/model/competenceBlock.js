const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('CompetenceBlock', new Schema({
    name: String,
    description:String,
    competence:Array
},
{ versionKey: false }));