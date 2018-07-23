var express = require('express');
var bcrypt = require('bcrypt');
var waterfall = require('async-waterfall');
var models = require('../models');
var router = express.Router();

router.get('/connexion', function(req, res, next) {
    if(req.session.connected){ 
        res.redirect("/admin/gestion");
    } else {
        res.render("pages/connection-admin", {
            error: ""
        });
    }
});

router.post('/connexion', function(req, res, next) {

    if(req.session.connected){ res.redirect("/admin/gestion"); }

    if(req.body.login == "" || req.body.password == "") {
        res.render("pages/connection-admin", {
            error: "Veuillez précisez un login et mot de passe."
        });
    } 

    models.Administrator.findAll({
        where: { login: req.body.login }
    }).then(function(results){
        if(results.length == 0){
            res.render("pages/connection-admin", {
                error: "Combinaison login/password non valide."
            })
        }
        else {
            results.forEach(function(result){
                if (bcrypt.compareSync(req.body.password, result.password)){

                    req.session.connected = 1;

                    res.redirect("/admin/gestion")
                }
            });

            res.render("pages/connection-admin", {
                error: "Combinaison login/password non valide."
            });
        }
    }).catch(function(error){
        res.render("pages/connection-admin", {
            error: "Erreur interne : " + error
        });
    });
});

router.get('/gestion', function(req, res, next){
    if(!req.session.connected){
        res.redirect("/admin/connexion");
    } 
    else {
        models.NavigationElement.findAll({
            attributes: ['id', 'title', 'order'],
            order: [
                ['order', 'ASC'],
            ],
            include: [
                { 
                    model: models.NavigationSubElement,
                    order: [
                        ['order', 'ASC'],
                    ],
                    required: false,
                    attributes: ['id', 'title', 'order'],
                    include: [
                        {
                            model: models.PageContent,
                            order: [
                                ['order', 'ASC']
                            ],
                            required: false,
                            attributes: ['id', 'content', 'type', 'order']
                        }
                    ]
                }
            ]
        }).then(function(results){
            res.render("pages/gestion-admin", {
                structure: results 
            });
        }).catch(function(error){
            
        });
    }
});

router.post('/gestion', function(req, res, next){
    if(!req.session.connected){
        res.redirect("/admin/connexion");
    }
    else {
        if(req.body.formtype && req.body.formtype == "addnavelement"){
            models.NavigationElement.max('order').then(function(result){
                var order = result ? result + 1 : 1;
                models.NavigationElement.create({
                    title: req.body.element,
                    order: order
                }).then(function(navelement){
                    res.redirect("/admin/gestion");
                })
            });
        }
        else if(req.body.formtype && req.body.formtype == "addnavsubelement"){
            models.NavigationSubElement.max('order', { where: { NavigationElementId: req.body.idparent } }).then(function(result){
                var order = result ? result + 1 : 1;
                models.NavigationSubElement.create({
                    title: req.body.element,
                    order: order,
                    NavigationElementId: req.body.idparent
                }).then(function(navsubelement){
                    res.redirect("/admin/gestion");
                })
            });
        }
    }
});

module.exports = router;
