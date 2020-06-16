const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('UserCompetence', new Schema({
    
    competenceId:String,
    userId: String,
    userPercent: Number,
    teacherPercent: Number,
    isValidated: Boolean,
    documents : Array
},
{ versionKey: false }));