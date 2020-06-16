const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('Ressource', new Schema({
    title: String,
    content:String
},
{ versionKey: false }));