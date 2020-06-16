const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('Promotion', new Schema({
    name: String,
    competenceBlock:Array,
    student: Array
},
{ versionKey: false }));