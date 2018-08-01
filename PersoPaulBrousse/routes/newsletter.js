var express = require('express');
var fs = require('fs');
var models = require('../models');
var router = express.Router();

router.post('/subscribe', function(req, res, next){
    if(req.body.mail == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }
    
    models.Subscribers.findOne({
        where: { mail: req.body.mail }
    }).then(function(subs){
       if(subs){
           return res.status(500).json({'error': "Ce mail souscrit déjà à la newsletter"});
       } else {
           models.Subscribers.create({
               mail: req.body.mail
           }).then(function(subs){
               return res.status(200).json({'success': "Vous êtes bien inscrit à la newsletter"});
           }).catch(function(error){
               
           })
       }
    }).catch(function(error){
        
    });
});

module.exports = router;