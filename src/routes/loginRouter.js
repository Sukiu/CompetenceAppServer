const express = require('express');
const router = express.Router();


router.post('/login', (req, res) => {
    const {
        model: {User}
    } = req;


    const userReq = {
        "username": req.body.username,
        "password": req.body.password
    }
    console.log(req.body)

    User.findOne({username:userReq.username},(err,user)=>{
        if (user === null || err) { 
            return res.status(400).send({ 
                message : "Utilisateur non trouvé."
            });
        }
        else{
            if(user.validPassword(userReq.password)){
                console.log(user)
                return res.json(
                    user
                );
            }
            else{
                return res.status(400).send({ 
                    message : "Mot de passe erroné."
                }); 
            }
        }
    })
















});

module.exports = router;