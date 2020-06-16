const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('Document', new Schema({
    link: String
},
{ versionKey: false }));