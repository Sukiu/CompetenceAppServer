const express = require('express');
const router = express.Router();

router.get('/competences/:id/ressources', (req, res) => {
    const { 
        params : {id},
        model: {Competence,Ressource}
    } = req;

    Competence.findById(id,(err, result) => {
        const promises = [];
        const jsonResult = [];
        if(!result){
            res.json([]);
            next();
            return;
        }
         result.ressource.forEach((element,index,arr) => {
            const promise = new Promise((resolve,reject) => {
                Ressource.findById(element,(err,resprom) => {
                    if(err) reject();
                    if(resprom !== null) jsonResult.push(resprom);
                    resolve(resprom);
                });
            });
            promises.push(promise);
        })
        Promise.all(promises).then((values) => res.json(values)).catch(() => res.json([]));
    }).catch(()=> res.json([]));
});


router.post('/competences/:id/ressources', (req, res) => {
    const { 
        params : {id},
        model: {Competence,Ressource}
    } = req;
    
    const ressource = req.body;
    
    if(!ressource){
        res.status(400).json({"err":"Id competence introuvable"});
    }
    
    Competence.findById(id,(err, result) => {
        const newRessource = new Ressource(ressource);

        newRessource.save(() => {
            console.log(newRessource);
            res.json(newRessource);
        });
        result.ressource.push(newRessource.id);
        result.save();
    }).catch((err) => {
        res.status(404);
        res.json({err: "Id competence introuvable"});
    })

});


router.delete('/competences/:compId/ressources/:id', (req, res,next) => {
    const { 
        params : {id,compId},
        model: {Competence,Ressource}
    } = req;

    if(!compId || !id){
        res.status(400).json({"err":"Url introuvable"});
    }

    Ressource.findByIdAndDelete(id, (err,resu) => {
        if(err) {
            res.status(400).json({"err":"Document introuvable"});
            next();
        }

        Competence.findById(compId,(err, result) => {
            if(result.ressource.includes(id)){
                const index = result.ressource.indexOf(id);
                result.ressource.splice(index,1);
                result.save();
                res.status(200).json({"succes":true});
            }
        })
    }).catch((err) => res.status(404).json({"err":err}));
});


module.exports = router;