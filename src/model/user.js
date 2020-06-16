const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto')

const UserSchema =  new Schema({
    username:   String,
    firstName:  String,
    surname:    String,
    password:   String,
    salt:       String,
    isAdmin:    Boolean,
    isTeacher:  Boolean,
    promotion:  Array,
    competence: Array
},
{ versionKey: false });

UserSchema.methods.validPassword = function(password) { 
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
    return this.password === hash; 
}; 

UserSchema.methods.setPassword = function(password) { 
    this.salt = crypto.randomBytes(16).toString('hex'); 
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
};


module.exports = mongoose.model('User',UserSchema);