const express = require('express');
const router = express.Router();




router.put('/usercompetences/:id', (req, res) => {
    const { 
        params : {id},
        body : usercompetence,
        model: {UserCompetence}
    } = req;
    console.log(usercompetence);
    UserCompetence.findByIdAndUpdate(id, usercompetence, (err,result) => {
        res.json(result);
    });
});


module.exports = router;