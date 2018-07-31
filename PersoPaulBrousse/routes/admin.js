var express = require('express');
var bcrypt = require('bcrypt');
var waterfall = require('async-waterfall');
var formidable = require('formidable');
var fs = require('fs');
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

router.get('/gestion/documents', function(req, res, next){
    if(!req.session.connected){
        res.redirect("/admin/connexion");
    } else {
        var arr = [];

        fs.readdirSync("./public/images").forEach(file => {
            arr.push(file);
        });

        res.render("pages/gestion-document-admin", {
            files: arr
        });
    };
});

router.get('/gestion/:id', function(req, res, next){
    if(!req.session.connected){
        res.redirect("/admin/connexion");
    } 
    else{
        models.NavigationSubElement.findOne({
            where: { id: req.params.id }
        }).then(function(element){
            if(!element){
                res.redirect("/admin/gestion");
            } else {
                if(element.type.localeCompare("CONTENT") == 0){
                    models.PageContent.findAll({
                        where: { NavigationSubElementId: req.params.id },
                        order: [
                            ['order', 'ASC'],
                        ]
                    }).then(function(pagecontents){
                        res.render("pages/gestion-content-admin", {
                            idpage: element.id,
                            page: element.title,
                            contents: pagecontents
                        });
                    }).catch(function(error){

                    });
                }
                else if(element.type.localeCompare("LIST") == 0){
                    models.PageListElement.findAll({
                        where: { NavigationSubElementId: req.params.id },
                        attributes: ["id", "createdAt", "NavigationSubElementId", "description", "title", "illustration", "type"]
                    }).then(function(pagelistelements){
                        res.render("pages/gestion-articles-admin", {
                            idpage: element.id,
                            page: element.title,
                            articles: pagelistelements
                        }) 
                    }).catch(function(error){

                    });
                }
                else {
                    res.redirect("/admin/gestion");
                }
            }
        })
    }
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
                    attributes: ['id', 'title', 'order', 'type']
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

router.get('/article/:id/content', function(req, res, next){
    if(!req.session.connected){
        res.redirect("/admin/connexion");
    } 
    else {
        models.PageListElement.findOne({
            where: {
                id: req.params.id
            }
        }).then(function(element){
            if(!element){
                return res.status(404).json({'error': "L'élément de liste n'existe pas"})
            } else {
                return res.status(200).json({'success': element});
            }
        }).catch(function(error){

        });
    }
});

router.get('/', function(req, res, next){
    if(req.session.connected){ 
        res.redirect("/admin/gestion");
    } else {
        res.redirect("/admin/connexion");
    } 
});

router.post('/gestion/documents', function(req, res, next){
    try{
        if(!req.session.connected){
            res.redirect("/admin/connexion");
        } else {
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                var oldpath = files.filetoupload.path;
                var newpath = "./public/images/" + files.filetoupload.name;
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                    var arr = [];
                    fs.readdirSync("./public/images").forEach(file => {
                        arr.push(file);
                    });
                    res.render("pages/gestion-document-admin", {
                        files: arr
                    });
                });
            });
        }
    }catch(error){
        console.log(error);
    }
});

router.post('/gestion/documents/delete', function(req, res, next){
    if(!req.session.connected){
        res.redirect("/admin/connexion");
    } 

    if(req.body.filename == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    fs.unlink('./public/images/' + req.body.filename, (err) => {
        if (err) {
            return res.status(404).json({'error': "Le fichier n'existe pas" + err});
        } else {
            return res.status(200).json({'success': "Le fichier a bien été supprimé !"});
        }
    });
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

    if(req.body.name == null || req.body.type == null || req.body.idparent == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.NavigationSubElement.max('order', { where: { NavigationElementId: req.body.idparent } }).then(function(result){
        var order = result ? result + 1 : 1;
        models.NavigationSubElement.create({
            title: req.body.name,
            type: req.body.type,
            order: order,
            NavigationElementId: req.body.idparent
        }).then(function(navsubelement){
            if(req.body.type.localeCompare("CONTENT") == 0){
                models.PageContent.create({
                    content: "",
                    order: 1,
                    NavigationSubElementId: navsubelement.id
                }).then(function(pagecontent){
                    return res.status(200).json({'success': "L'élément de sous-navigation a bien été ajouté !"});
                }).catch(function(error){

                });
            } 
            else if(req.body.type.localeCompare("LINK") == 0){
                models.PageLink.create({
                    link: "",
                    NavigationSubElementId: navsubelement.id
                }).then(function(pagelink){
                    return res.status(200).json({'success': "L'élément de sous-navigation a bien été ajouté !"});
                }).catch(function(error){

                });
            }
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

router.post('/gestion/navsubelement/updatelink', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.navsubelementid == null || req.body.newlink == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.PageLink.findOne({
        where: { NavigationSubElementId: req.body.navsubelementid }
    }).then(function(pagelink){
        if(pagelink){
            pagelink.link = req.body.newlink;
            pagelink.save().then(function(){
                return res.status(200).json({'success': 'Le lien du document a bien été changé!'}); 
            });
        } else {
            return res.status(404).json({'error': 'Impossible de trouver le lien pour ce sous-élément, il vaudrait mieux le supprimer'});
        }
    }).catch(function(error){

    });
});

router.post('/gestion/navsubelement/addcontent', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.navsubelementid == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.NavigationSubElement.findOne({
        where: { id: req.body.navsubelementid }
    }).then(function(nav){
        if(nav.type.localeCompare("CONTENT") != 0){
            return res.status(500).json({'error': "L'élément de sous-navigation n'est pas de type content"});
        } else {
            models.PageContent.max('order', { where: { NavigationSubElementId: req.body.navsubelementid } }).then(function(max){
                if(!max){
                    max = 0;
                }
                models.PageContent.create({
                    content: "",
                    order: max + 1,
                    NavigationSubElementId: req.body.navsubelementid
                }).then(function(content){
                    return res.status(200).json({'success': "L'élément de contenu a bien été créé"}); 
                }).catch(function(error){

                });
            }).catch(function(error){

            });
        }
    })
});

router.post('/gestion/navsubelement/deletecontent', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.contentid == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.PageContent.findOne({
        where: {
            id: req.body.contentid
        }
    }).then(function(pc){
        if(pc){
            if(pc.order != 1){
                var orderpc = JSON.parse(JSON.stringify(pc.order));
                var subelement = JSON.parse(JSON.stringify(pc.NavigationSubElementId));

                pc.destroy({force: true}).then(function(){
                    models.PageContent.findAll({
                        where:{
                            order: { [op.gt]: orderpc },
                            NavigationSubElementId: subelement
                        },
                        order: [
                            ['order', 'ASC'],
                        ]
                    }).then(function(pcs){
                        pcs.forEach(function(pc){
                            pc.order = pc.order - 1;
                            pc.save();
                        });
                        return res.status(200).json({'success': "Element de contenu bien supprimé"});
                    }).catch(function(error){

                    });
                }).catch(function(error){
                });
            } else {
                return res.status(500).json({'error': "Il faut au moins un élément de contenu pour ce type d'élément de sous-navigation"});
            }
        } else {
            return res.status(404).json({'error': "Le content correspondant à cet id n'existe pas"});
        }
    });
});

router.post('/gestion/pagecontent/modify', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.id == null || req.body.content == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.PageContent.findOne({
        where: {
            id: req.body.id
        }
    }).then(function(pc){
        if(pc){
            pc.content = req.body.content;
            pc.save().then(function(){
                return res.status(200).json({'success': "Le contenu du content a bien été modifié"}); 
            });
        } else {
            return res.status(404).json({'error': "Le content correspondant à cet id n'existe pas"});
        }
    }).catch(function(error){

    });
});

router.post('/gestion/articles/delete', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.listelementid == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }

    models.PageListElement.findOne({
        where: { id: req.body.listelementid }
    }).then(function(result){
        result.destroy({force: true});
        return res.status(200).json({'success': "L'élément a bien été supprimé"});
    }).catch(function(error){

    });
});

router.post('/gestion/articles/add', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.title == null || req.body.description == null || req.body.illustration == null || req.body.content == null || req.body.type == null || req.body.subnavid == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }
    
    models.PageListElement.create({
        title: req.body.title,
        description: req.body.description,
        illustration: req.body.illustration,
        content: req.body.content,
        type: req.body.type,
        NavigationSubElementId: req.body.subnavid
    }).then(function(element){
       return res.status(200).json({'success': "L'article a bien été créé"}); 
    }).catch(function(error){
        console.log(error);
    });
});

router.post('/gestion/articles/modify', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.id == null || req.body.title == null || req.body.description == null || req.body.illustration == null || req.body.type == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }
    
    models.PageListElement.findOne({
        where: {
            id: req.body.id
        }
    }).then(function(element){
       if(element){
            element.title = req.body.title,
            element.description = req.body.description,
            element.illustration = req.body.illustration,
            element.type = req.body.type
           element.save();
           return res.status(200).json({'success': "L'élément de liste a bien été modifié"});
       } else {
           return res.status(404).json({'error': "L'élément de liste n'existe pas"});
       }
    }).catch(function(error){
        console.log(error);
    });
});

router.post('/gestion/articles/content/modify', function(req, res, next){
    if(!req.session.connected){
        return res.status(500).json({'error': "Vous n'êtes pas connecté !"});
    }

    if(req.body.id == null || req.body.content == null){
        return res.status(500).json({'error': "Il manque un paramètre"});
    }
    
    models.PageListElement.findOne({
        where: {
            id: req.body.id
        }
    }).then(function(element){
       if(element){
        element.content = req.body.content
           element.save();
           return res.status(200).json({'success': "L'élément de liste a bien été modifié"});
       } else {
           return res.status(404).json({'error': "L'élément de liste n'existe pas"});
       }
    }).catch(function(error){
        console.log(error);
    });
});

module.exports = router;
