const express = require('express');
const router = express.Router();


router.get('/competences/:id', (req, res) => {
    const { 
        params : {id},
        model: {Competence}
    } = req;

    Competence.findById(id,(err, result) => {
        console.log(result)
        res.json(result);
    });
});


router.get('/competences/:id/usercompetences', (req, res) => {
    const { 
        params : {id},
        model: {UserCompetence,User}
    } = req;


    UserCompetence.find({"competenceId":id},(err, result) => {
        if(!result || err){
            res.json([]);
            next();
            return;
        }
        
        const promises = [];


        result.forEach((element,index,arr) => {
            const promise = new Promise((resolve,reject) => {
                User.findById(element.userId,(err,resUser) => {
                    if(err) reject();
                    const elementCopy = element.toObject();
                    
                    elementCopy.firstName = resUser.firstName;
                    
                    elementCopy.surname = resUser.surname;
                    resolve(elementCopy);
                });
            });
            promises.push(promise);
        })

        Promise.all(promises)
        .then((values) => {
            console.log(values)
            res.json(values)
        }).catch(() => res.json([]));
        
    }).catch(()=> res.json({"err":"Erreur"}));
});




module.exports = router;