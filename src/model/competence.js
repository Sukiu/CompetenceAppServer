const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('Competence', new Schema({
    name: String,
    description:String,
    ressource:Array
},
{ versionKey: false }));