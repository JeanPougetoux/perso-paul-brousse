var express = require('express');
var bcrypt = require('bcrypt');
const models = require('../models');
var router = express.Router();

router.get('/', function(req, res, next) {
    bcrypt.hash("plout", 10, function(err, hash) {
        res.render("pages/admin", {
            error: hash
        });
    });
});

router.get('/test', function(req, res, next) {
    bcrypt.compare("plout", "$2b$10$GolqWMLZ9sqvu8dhgKCFlu6MDEqQfFkUdNcIrm9YKDPjAZvVeAvYG", function(err, bres) {
        if(bres){
            res.render("pages/admin", {
                error: "Utilisateur trouvé."
            });
        }
    });
});

router.post('/', function(req, res, next) {

    if(req.body.login == "" || req.body.password == "") {
        res.render("pages/admin", {
            error: "Veuillez précisez un login et mot de passe."
        });
    } 

    models.Administrator.findAll({
        where: { login: req.body.login }
    }).then(function(results){
        if(results.length == 0){
            res.render("pages/admin", {
                error: "Combinaison login/password non valide."
            })
        }
        else {
            results.forEach(function(result){
                console.log(result.password);
                bcrypt.compare("plout", result.password, function(err, bres) {
                    console.log(bres);
                    if(bres){
                        res.render("pages/admin", {
                            error: "Utilisateur trouvé."
                        });
                    }
                });
            });
            // ICI ERREUR ASYNCHRONE
            res.render("pages/admin", {
                error: "Combinaison login/password non valide."
            });
        }
    }).catch(function(error){
        res.render("pages/admin", {
            error: "Erreur interne : " + error
        });
    });

});

module.exports = router;
