const express = require('express');
const router = express.Router();



router.delete('/usercompetences/:usercompId/documents/:id', (req, res,next) => {
    const { 
        params : {usercompId,id},
        model: {Document,UserCompetence}
    } = req;
    if(!usercompId || !id){
        res.status(400).json({"err":"Url introuvable"});
    }

    Document.findByIdAndDelete(id, (err,resu) => {
        if(err) {
            res.status(400).json({"err":"Document introuvable"});
            next();
        }

        UserCompetence.findById(usercompId,(err, result) => {
            if(result.documents.includes(id)){
                const index = result.documents.indexOf(id);
                result.documents.splice(index,1);
                result.save();
                res.status(200).json({"succes":true});
            }
        })
    }).catch((err) => res.status(404).json({"error":err}));
});

router.post('/usercompetences/:id/documents', (req, res,next) => {

    const { 
        params : {id},
        model: {UserCompetence,Document},
    } = req;

    const document = req.body;

    if(!document){
        res.status(400).json({"err":"Id usercompetence introuvable"});
    }
    
    UserCompetence.findById(id,(err, result) => {
        const newDocument = new req.model.Document(document);

        newDocument.save(() => {
            console.log(newDocument);
            res.json(newDocument); 
        });
        result.documents.push(newDocument.id);
        result.save();

    }).catch((err) => {
        res.status(404);
        res.json({err: "Id usercompetence introuvable"});
    })
});

router.get('/usercompetences/:id/documents', (req, res) => {
    const {
        params : {id},
        model: {UserCompetence,Document}
    } = req;

    UserCompetence.findById(id,(err, result) => {
        const promises = [];
        const jsonResult = [];
        if(err){
            res.json([]);
            next();
            return;
        }
        result.documents.forEach((element) => {
            const promise = new Promise((resolve,reject) => {
                Document.findById(element,(err,resprom) => {
                    if(err) reject();
                    if(resprom)jsonResult.push(resprom);
                    resolve(resprom);
                });
            });
            promises.push(promise);
        })
        Promise.all(promises).then((values) => res.json(jsonResult)).catch(() => res.json([]));
    }).catch(()=> res.json([]));
});


router.get('/usercompetences/:id', (req, res) => {
    const {
        params : {id},
        model: {UserCompetence}
    } = req;

    UserCompetence.findById(id,(err, result) => {
        res.status(200).json(result);
    }).catch(()=> res.status(400).json({"error":"Une erreur est survenue."}));
});

module.exports = router;