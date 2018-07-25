var express = require('express');
var bcrypt = require('bcrypt');
var waterfall = require('async-waterfall');
var models = require('../models');
var router = express.Router();
var sequelize = require('sequelize');
var op = sequelize.Op;


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
                [models.NavigationSubElement, 'order', 'ASC']
            ],
            include: [
                { 
                    model: models.NavigationSubElement,
                    required: false,
                    attributes: ['id', 'title', 'order']
                }
            ]
        }).then(function(results){
            console.log(JSON.stringify(results));
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

router.post('/gestion/navelement/modify', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.newname == null && req.body.navelementid == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.NavigationElement.findOne({
        where: { id: req.body.navelementid }
    }).then(function(element){
        if(element){
            element.title = req.body.newname
            element.save().then(function(){
                return res.status(200).json({'success': "Le titre de l'élément de navigation a bien été changé"});
            });
        } else {
            return res.status(404).json({'error': "L'élément de navigation correspondant à cet id n'a pas été trouvé"});     
        }
    }).catch(function(error){

    });
});

router.post('/gestion/navsubelement/modify', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.newname == null && req.body.navsubelementid == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.NavigationSubElement.findOne({
        where: { id: req.body.navsubelementid }
    }).then(function(element){
        if(element){
            element.title = req.body.newname
            element.save().then(function(){
                return res.status(200).json({'success': "Le titre de l'élément de sous-navigation a bien été changé"});
            });
        } else {
            return res.status(404).json({'error': "L'élément de sous-navigation correspondant à cet id n'a pas été trouvé"});     
        }
    }).catch(function(error){

    });
});

router.post('/gestion/navelement/delete', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.navelementid == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.NavigationElement.findOne({
        where: { id: req.body.navelementid }
    }).then(function(result){
        result.destroy({force: true});
        models.NavigationSubElement.findAll({
            where: { NavigationElementId: req.body.navelementid }
        }).then(function(results){
            results.forEach(function(result){
                result.destroy({force: true});
            });
            return res.status(200).json({'success': "L'élément de navigation a bien été supprimé"});
        }).catch(function(error){

        })
    }).catch(function(error){

    });
});

router.post('/gestion/navsubelement/delete', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.navsubelementid == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.NavigationSubElement.findOne({
        where: { id: req.body.navsubelementid }
    }).then(function(result){
        result.destroy({force: true}).then(function(){
            return res.status(200).json({'success': "L'élément de sous-navigation a bien été supprimé"});
        });
    }).catch(function(error){

    });
});

router.post('/gestion/navelement/up', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.navelementid == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.NavigationElement.findOne({
        where: { id: req.body.navelementid }
    }).then(function(element){
        if(element){
            models.NavigationElement.max('order', { where: { order: { [op.lt]: element.order } } }).then(max => {
               models.NavigationElement.findOne({
                   where: { order: max }
               }).then(function(secondElement){
                  var temp = JSON.parse(JSON.stringify(element.order));
                   var temp2 = JSON.parse(JSON.stringify(secondElement.order));
                   element.order = -1;
                   element.save().then(function(){
                       secondElement.order = temp;
                       secondElement.save().then(function(){
                          element.order = temp2;
                           element.save().then(function(){
                               return res.status(200).json({'success': "Les deux éléments de navigation ont bien été swappés"});
                           })
                       });
                   });
               }).catch(function(error){
                   
               });
            });
        } else {
            return res.status(404).json({'error': "L'élément de navigation correspondant à cet id n'a pas été trouvé"});     
        }
    }).catch(function(error){

    });
});

router.post('/gestion/navelement/down', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.navelementid == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.NavigationElement.findOne({
        where: { id: req.body.navelementid }
    }).then(function(element){
        if(element){
            models.NavigationElement.min('order', { where: { order: { [op.gt]: element.order } } }).then(min => {
               models.NavigationElement.findOne({
                   where: { order: min }
               }).then(function(secondElement){
                  var temp = JSON.parse(JSON.stringify(element.order));
                   var temp2 = JSON.parse(JSON.stringify(secondElement.order));
                   element.order = -1;
                   element.save().then(function(){
                       secondElement.order = temp;
                       secondElement.save().then(function(){
                          element.order = temp2;
                           element.save().then(function(){
                               return res.status(200).json({'success': "Les deux éléments de navigation ont bien été swappés"});
                           })
                       });
                   });
               }).catch(function(error){
                   
               });
            });
        } else {
            return res.status(404).json({'error': "L'élément de navigation correspondant à cet id n'a pas été trouvé"});     
        }
    }).catch(function(error){

    });
});

router.post('/gestion/navsubelement/up', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.navsubelementid == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.NavigationSubElement.findOne({
        where: { id: req.body.navsubelementid }
    }).then(function(element){
        if(element){
            models.NavigationSubElement.max('order', { where: { order: { [op.lt]: element.order } }, NavigationElementId: element.NavigationElementId }).then(max => {
               models.NavigationSubElement.findOne({
                   where: { order: max, NavigationElementId: element.NavigationElementId }
               }).then(function(secondElement){
                  var temp = JSON.parse(JSON.stringify(element.order));
                   var temp2 = JSON.parse(JSON.stringify(secondElement.order));
                   element.order = -1;
                   element.save().then(function(){
                       secondElement.order = temp;
                       secondElement.save().then(function(){
                          element.order = temp2;
                           element.save().then(function(){
                               return res.status(200).json({'success': "Les deux éléments de sous-navigation ont bien été swappés"});
                           })
                       });
                   });
               }).catch(function(error){
                   
               });
            });
        } else {
            return res.status(404).json({'error': "L'élément de sous-navigation correspondant à cet id n'a pas été trouvé"});     
        }
    }).catch(function(error){

    });
});

router.post('/gestion/navsubelement/down', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.navsubelementid == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.NavigationSubElement.findOne({
        where: { id: req.body.navsubelementid }
    }).then(function(element){
        if(element){
            models.NavigationSubElement.min('order', { where: { order: { [op.gt]: element.order } }, NavigationElementId: element.NavigationElementId }).then(min => {
               models.NavigationSubElement.findOne({
                   where: { order: min, NavigationElementId: element.NavigationElementId }
               }).then(function(secondElement){
                  var temp = JSON.parse(JSON.stringify(element.order));
                   var temp2 = JSON.parse(JSON.stringify(secondElement.order));
                   element.order = -1;
                   element.save().then(function(){
                       secondElement.order = temp;
                       secondElement.save().then(function(){
                          element.order = temp2;
                           element.save().then(function(){
                               return res.status(200).json({'success': "Les deux éléments de sous-navigation ont bien été swappés"});
                           })
                       });
                   });
               }).catch(function(error){
                   
               });
            });
        } else {
            return res.status(404).json({'error': "L'élément de sous-navigation correspondant à cet id n'a pas été trouvé"});     
        }
    }).catch(function(error){

    });
});

router.get('/', function(req, res, next){
    if(req.session.connected){ 
        res.redirect("/admin/gestion");
    } else {
        res.redirect("/admin/connexion");
    } 
});

module.exports = router;
