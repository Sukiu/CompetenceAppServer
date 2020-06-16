const express = require('express');
const router = express.Router();


router.get('/competenceblocks/:id', (req, res) => {
    const { 
        params : {id},
        model: {CompetenceBlock}
    } = req;

    CompetenceBlock.findById(id,(err, result) => {
        console.log(result)
        res.json(result);
    });
});

router.get('/competenceblocks/:id/competences', (req, res,next) => {
    const { 
        params : {id},
        model: {Competence,CompetenceBlock}
    } = req;

    CompetenceBlock.findById(id,(err, result) => {
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

router.put('/competenceblocks/:id/competences', (req, res) => {
    const { 
        params : {id},
        body : {competence},
        model: {CompetenceBlock}
    } = req;

    CompetenceBlock.findById(id,(err,result) => {
        if(err){
            res.status(404);
        }
        const competences = req.body.competence;
        console.log(competences)
        result.competence = competences;
        result.save();
        
        res.json(result);
    })
});

router.delete('/competenceblocks/:id', (req, res,next) => {
    const { 
        params : {id},
        model: {CompetenceBlock}
    } = req;
    if( !id){
        res.status(400).json({"err":"Url introuvable"});
    }

    CompetenceBlock.findByIdAndDelete(id, (err,resu) => {
        if(err) {
            res.status(400).json({"err":"Document introuvable"});
            next();
        }
        res.status(200).json({"succes":true});
    }).catch((err) => res.status(400).json({"error":err}));
});


module.exports = router;