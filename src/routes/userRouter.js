const express = require('express');
const router = express.Router();



router.get('/users/:id', (req, res) => {
    const { 
        params : {id},
        model: {User}
    } = req;

    User.findById(id,(err, result) => {
        console.log(result)
        res.json(result);
    });
});

router.get('/users/:id/competences', (req, res) => {
    const { 
        params : {id},
        model: {User,UserCompetence}
    } = req;

    const user = User.findById(id,(err, result) => {
        console.log(result)
        const promises = [];

        const jsonResult = [];
        if(!result){
            res.json([]);
            next();
            return;
        }
         result.competence.forEach((element,index,arr) => {
            const promise = new Promise((resolve,reject) => {
                UserCompetence.findById(element,(err,resprom) => {
                    if(!resprom) reject();
                    jsonResult.push(resprom);
                    resolve(resprom);
                });
            });
            promises.push(promise);
        })
        Promise.all(promises).then((values) => res.json(values)).catch(() => res.json([]));
    }).catch(()=> res.json([]));
});

router.put('/users/:id/teachercompetences', (req, res) => {
    const { 
        params : {id},
        body: {competences},
        model: {User,Competence}
    } = req;

    const user = User.findById(id,(err, result) => {
        console.log(result)
        const promises = [];

        const jsonResult = [];
        if(!result){
            res.json([]);
            next();
            return;
        }
        result.competence = competences;
        result.save();
        res.status(200).json({"sucess": true})
    }).catch(()=> res.json([]));
});

router.get('/users/:id/teachercompetences', (req, res) => {
    const { 
        params : {id},
        model: {User,Competence}
    } = req;

    const user = User.findById(id,(err, result) => {
        console.log(result)
        const promises = [];

        const jsonResult = [];
        if(!result){
            res.json([]);
            next();
            return;
        }
         result.competence.forEach((element,index,arr) => {
            const promise = new Promise((resolve,reject) => {
                Competence.findById(element,(err,resprom) => {
                    if(err) reject();
                    if(resprom !== null)jsonResult.push(resprom);
                    resolve(resprom);
                });
            });
            promises.push(promise);
        })
        Promise.all(promises).then((values) => res.json(jsonResult)).catch(() => res.json([]));
    }).catch(()=> res.json([]));
});



router.get('/users/:id/promotions', (req, res) => {
    const { 
        params : {id},
        model: {User,Promotion}
    } = req;


    const user = User.findById(id,(err, result) => {
        console.log(result)
        const promises = [];

        const jsonResult = [];
         result.promotion.forEach((element,index,arr) => {
            const promise = new Promise((resolve,reject) => {
                Promotion.findById(element,(err,resprom) => {
                    if(!resprom) reject();
                    console.log(resprom.id)
                    jsonResult.push(resprom);
                    resolve(resprom);
                });
            });
            promises.push(promise);
        })
        Promise.all(promises).then((values) => res.json(values)).catch(() => res.json([]));

    }).catch(()=> res.json([]));
});





router.post('/users/:id/competences', (req, res,next) => {

    const { 
        params : {id},
        model: {User,UserCompetence},
    } = req;

    const usercompetence = req.body;

    if(!usercompetence.competenceId){
        res.status(404);
        res.json({err: "Missing competenceId in POST"});
        next();
        return;
    }

    usercompetence.teacherPercent = usercompetence.teacherPercent || 0;
    
    usercompetence.userPercent = usercompetence.userPercent || 0;


    
    usercompetence.isValidated = usercompetence.isValidated || false;

    usercompetence.userId = id;

    const user = User.findById(id,(err, result) => {
        const requserCompetence = new req.model.UserCompetence(usercompetence);

        requserCompetence.save(() => {
            res.json(requserCompetence); 
        });
        result.competence.push(requserCompetence.id);
        result.save();

    }).catch((err) => {
        res.status(404);
        res.json({err: "Incorrect userId"});
    })
});

module.exports = router;