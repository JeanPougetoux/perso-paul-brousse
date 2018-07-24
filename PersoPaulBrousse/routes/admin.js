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

router.post('/gestion/navelement/add', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.name == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.NavigationElement.max('order').then(function(result){
        var order = result ? result + 1 : 1;
        models.NavigationElement.create({
            title: req.body.name,
            order: order
        }).then(function(navelement){
            return res.status(200).json({'success': "L'élément de navigation a bien été ajouté !"});
        })
    });
});

router.post('/gestion/navsubelement/add', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.name == null || req.body.idparent == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.NavigationSubElement.max('order', { where: { NavigationElementId: req.body.idparent } }).then(function(result){
        var order = result ? result + 1 : 1;
        models.NavigationSubElement.create({
            title: req.body.name,
            order: order,
            NavigationElementId: req.body.idparent
        }).then(function(navsubelement){
            return res.status(200).json({'success': "L'élément de sous-navigation a bien été ajouté !"});
        })
    });
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
        else if(req.body.formtype && req.body.formtype == "deletenavelement"){
            models.NavigationElement.findOne({
                where: { id: req.body.id }
            }).then(function(result){
                result.destroy({force: true});
                models.NavigationSubElement.findAll({
                    where: { NavigationElementId: req.body.id }
                }).then(function(results){
                    results.forEach(function(result){
                        result.destroy({force: true});
                    });
                    res.redirect("/admin/gestion");
                }).catch(function(error){

                })
            }).catch(function(error){

            });
        }
        else if(req.body.formtype && req.body.formtype == "deletenavsubelement"){
            models.NavigationSubElement.findOne({
                where: { id: req.body.id }
            }).then(function(result){
                result.destroy({force: true});
                res.redirect("/admin/gestion");
                return;
            }).catch(function(error){

            });
        }
    }
});

router.get('/', function(req, res, next){
    if(req.session.connected){ 
        res.redirect("/admin/gestion");
    } else {
        res.redirect("/admin/connexion");
    } 
});

module.exports = router;
