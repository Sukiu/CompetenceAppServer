const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");





router.get('/promotions/:id', (req, res) => {
    const { 
        params : {id},
        model: {Promotion}
    } = req;

    Promotion.findById(id,(err, result) => {
        
        res.json(result);
    });
});

router.get('/promotions/:id/competenceblocks', async (req, res) => {
    const { 
        params : {id},
        model: {CompetenceBlock,Promotion}
    } = req;

    Promotion.findById(id,(err, result) => {
        const promises = [];
        const jsonResult = [];
        if(err){
            res.json([]);
            next();
            return;
        }
        result.competenceBlock.forEach((element,index,arr) => {
            const promise = new Promise((resolve,reject) => {
                CompetenceBlock.findById(element,(err,resprom) => {
                    if(!resprom) reject();
                    
                    fetch(`http://localhost:16384/competenceblocks/${element}/competences`).then((result) => {
                        resprom.competence = result;
                        jsonResult.push(resprom);
                        resolve(resprom);
                    });
                });
            });
            promises.push(promise);
        })
        Promise.all(promises).then((values) => {
            console.log(values)
            res.json(values);
        }).catch(() => res.json([]));
    }).catch(()=> res.json([]));
});


router.put('/promotions/:id/users', (req, res) => {
    const { 
        params : {id},
        body : {users},
        model: {Promotion,User}
    } = req;

    Promotion.findById(id,(err,resultPromotion) => {
        const currentUsers = resultPromotion.student;
        
        const removedUsers = [];
        const addedUsers = [];

        currentUsers.forEach((user) =>{
            if(!users.includes(user)) removedUsers.push(user);
        });
        
        users.forEach((user) =>{
            if(!currentUsers.includes(user)) addedUsers.push(user);
        });

        removedUsers.forEach((removedUserId) => {
            User.findById(removedUserId,(error, removedUser) => {
                if(removedUser.promotion.includes(id)){
                    const index = removedUser.promotion.indexOf(id);
                    removedUser.promotion.splice(index,1);
                    removedUser.save();
                }
            })
        })
        addedUsers.forEach((addedUserId) => {
            User.findById(addedUserId,(error, addedUser) => {
                if(!addedUser.promotion.includes(id)){
                    addedUser.promotion.push(id);
                    addedUser.save();
                }
            })
        })
        resultPromotion.student = users;
        resultPromotion.save();

        res.json(resultPromotion);
    })

});

router.put('/promotions/:id/competenceblocks', (req, res) => {
    const { 
        params : {id},
        body : {competenceblocks},
        model: {Promotion}
    } = req;

    Promotion.findById(id,(err,result) => {
        if(err){
            res.status(404).json({"err":"Error"});
        }
        result.competenceBlock = competenceblocks;
        result.save();
        
        res.json(result);
    })
});




module.exports = router;