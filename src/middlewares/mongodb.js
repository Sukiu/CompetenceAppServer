const mongoose = require('mongoose');
const User = require('../model/user.js');
const Promotion = require('../model/promotion.js');
const CompetenceBlock = require('../model/competenceBlock.js');
const Competence = require('../model/competence.js');
const Ressource = require('../model/ressource.js');
const UserCompetence = require('../model/userCompetence.js');

const Document = require('../model/document.js');


const stringConnect;

mongoose.connect(stringConnect,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const mongoDbMiddleware = (req, res, next) => {
    
    req.db = mongoose;
    req.model = {};

    req.model.User = User;
    req.model.Promotion = Promotion;
    req.model.CompetenceBlock = CompetenceBlock;
    req.model.Competence = Competence;
    req.model.Ressource = Ressource;
    req.model.UserCompetence = UserCompetence;
    req.model.Document = Document;
    

    next();
}

module.exports = mongoDbMiddleware;