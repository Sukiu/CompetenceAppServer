const express = require('express');
const router = express.Router();


router.get('/competences', (req, res) => {
    const { 
        params : {id},
        model: {Competence}
    } = req;
    Competence.find({},(err,doc)=>{
        res.json(doc)
    })
});


router.get('/competenceblocks', (req, res) => {
    const { 
        params : {id},
        model: {CompetenceBlock,Competence}
    } = req;
    CompetenceBlock.find({},(err,result)=>{
        const jsonResult = [];
        if(err){
            res.json([]);
            next();
            return;
        }
        const promisesCompetenceBlock = [];
        result.forEach((block) => {
            const blockPromise = new Promise((resolvePromotion,rejectPromotion) => {
                const promiseCompetence = [];
                
                block.competence.forEach((compId) => {
                    const promise = new Promise((resolve,reject) => {
                        Competence.findById(compId,(err,resComp) => {
                            if(err) reject();
                            if(resComp !== null) 
                            resolve(resComp);
                        });
                    });
                    promiseCompetence.push(promise);
                })
                Promise.all(promiseCompetence).then((values) =>{
                    const blockObj = block.toObject();
                    blockObj.competence = values;
                    console.log(blockObj)
                    resolvePromotion(blockObj);
                }).catch(() => {
                    block.competence = [];
                    rejectPromotion();
                });
            })
            promisesCompetenceBlock.push(blockPromise);
        })
        
        Promise.all(promisesCompetenceBlock).then((values) => {
            res.json(values);
        }).catch((err) => res.status(400).json({"err":err}))
    })
});

router.get('/users', (req, res) => {
    const { 
        params : {id},
        model: {User}
    } = req;
    User.find({},(err,doc)=>{
        res.json(doc)
    })
    
});

router.get('/promotions', (req, res) => {
    const { 
        params : {id},
        model: {Promotion,User}
    } = req;
    Promotion.find({},(err,result)=>{
        const jsonResult = [];
        if(err){
            res.json([]);
            next();
            return;
        }
        const promisesPromotion = [];
        result.forEach((promo) => {
            const promotionPromise = new Promise((resolvePromotion,rejectPromotion) => {
                const promisesStudent = [];
                
                promo.student.forEach((studentId) => {
                    const promise = new Promise((resolve,reject) => {
                        User.findById(studentId,(err,resStudent) => {
                            if(!resStudent) reject();
                            if(resStudent !== null) 
                            resolve(resStudent);
                        });
                    });
                    promisesStudent.push(promise);
                })
                Promise.all(promisesStudent).then((values) =>{
                    const promoObj = promo.toObject();
                    promoObj.users = values;
                    console.log(promoObj)
                    resolvePromotion(promoObj);
                }).catch(() => {
                    promo.users = [];
                    rejectPromotion();
                });
            })
            promisesPromotion.push(promotionPromise);
        })
        
        Promise.all(promisesPromotion).then((values) => {
            console.log(values);
            res.json(values);
        }).catch((err) => res.status(400).json({"err":err}))
    })
});


router.delete('/promotions/:id', (req, res,next) => {
    const { 
        params : {id},
        model: {User,Promotion}
    } = req;

    if(!id){
        res.status(400).json({"err":"Url introuvable"});
    }

    Promotion.findByIdAndDelete(id, (err,resu) => {
        if(err) {
            res.status(400).json({"err":"Promotion introuvable"});
            next();
            return;
        }
        User.find({ promotion: { $all: [id] }},(err,userResult) => {
            if(err) {
                res.status(400).json({"err":"Utilisateur introuvable"});
                next();
                return;
            }
            userResult.forEach(user => {
                const index = user.promotion.indexOf(id);
                user.promotion.splice(index,1);
                user.save();
            });
            res.status(200).json({"succes":true});
        })
    }).catch((err) => res.status(404).json({"err":err}));
});

router.delete('/users/:id', (req, res,next) => {
    const { 
        params : {id},
        model: {User,Promotion}
    } = req;

    console.log("a")
    if(!id){
        res.status(400).json({"err":"Url introuvable"});
    }

    User.findByIdAndDelete(id, (err,resu) => {
        if(err) {
            res.status(400).json({"err":"Utilisateur introuvable"});
            next();
            return;
        }
        Promotion.find({ student: { $all: [id] }},(err,promotionResult) => {
            promotionResult.forEach(promotion => {
                const index = promotion.student.indexOf(id);
                promotion.student.splice(index,1);
                promotion.save();
            });
            res.status(200).json({"succes":true});
        })
    }).catch((err) => res.status(404).json({"err":err}));
});

router.delete('/competences/:id', (req, res,next) => {
    const { 
        params : {id},
        model: {Competence,Ressource}
    } = req;

    if(!id){
        res.status(400).json({"err":"Url introuvable"});
    }

    Competence.findById(id, (err,resu) => {
        if(err) {
            res.status(400).json({"err":"Competence introuvable"});
            next();
            return;
        }


        const promises = [];
        console.log(resu);
        resu.ressource.forEach((ressourceId) => {
            const promise = new Promise((resolve,reject) => {
                Ressource.findByIdAndDelete(ressourceId, (error,result) => {
                    if(error) reject();
                    resolve();
                });
            })
            promises.push(promise);
        })
        Promise.all(promises).then(()=> {
            resu.remove();
            res.status(200).json({"succes":true})
        }).catch((err) => console.log(err))

    }).catch((err) => res.status(404).json({"err":err}));
});



router.post('/users', (req, res) => {
    const newUserJson = req.body;
    const newUser = new req.model.User(newUserJson);
    newUser.setPassword(newUserJson.clearPassword);
    newUser.save(() => {
        res.json(newUser); 
    });
});

router.post('/promotions', (req, res) => {
    const newPromotionJson = req.body;
    const newPromotion = new req.model.Promotion(newPromotionJson);
    newPromotion.save(() => {
        res.json(newPromotion); 
    });
});

router.post('/competenceblocks', (req, res) => {
    const newJson = req.body;
    const newObj = new req.model.CompetenceBlock(newJson);
    newObj.save(() => {
        res.json(newObj); 
    });
});

router.post('/competences', (req, res) => {
    const newJson = req.body;
    const newObj = new req.model.Competence(newJson);
    newObj.save(() => {
        res.json(newObj); 
    });
});

module.exports = router;
