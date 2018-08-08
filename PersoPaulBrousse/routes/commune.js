var express = require('express');
var models = require('../models');
var router = express.Router();

router.get('/article/:idArticle', function(req, res, next){
    models.PageListElement.findOne({
        where: { id: req.params.idArticle }
    }).then(function(article){
        if(article){
            return res.status(200).json({'success': article.content});
        } else {
            return res.status(404).json({'error': "L'article demandé n'existe pas"});
        }
    })
});

router.get('/:page/:subpage/:article', function(req, res, next){
    if(req.params.page.localeCompare(req.params.subpage) == 0){
        next();
    }
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
                attributes: ['id', 'title', 'order', 'type'],
                include: [
                    {
                        model: models.PageLink,
                        required: false,
                        attributes: ['link']
                    }
                ]
            }
        ]
    }).then(function(results){
        models.NavigationElement.findOne({
            where: { title: req.params.page }
        }).then(function(ne){
            if(ne){
                models.NavigationSubElement.findOne({
                    where: {
                        title: req.params.subpage,
                        NavigationElementId: ne.id
                    }
                }).then(function(nse){
                    if(nse){
                        models.PageListElement.findOne({
                            where: {
                                id: req.params.article,
                                NavigationSubElementId: nse.id,
                                type: "CONTENT"
                            }
                        }).then(function(article){
                           if(article){
                               res.render("pages/commune", {
                                    structure: results,
                                    type: "ARTICLE",
                                    content: article.content
                                })
                           } else {
                               next(); // 404
                           }
                        }).catch(function(error){
                            
                        });
                    } else {
                        next(); // 404
                    }
                }).catch(function(error){

                })
            } else {
                next(); // 404
            }
        }).catch(function(error){

        });
    }).catch(function(error){

    });
});

router.get('/:page/:subpage', function(req, res, next){
    if(req.params.page.localeCompare(req.params.subpage) == 0){
        next();
    }
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
                attributes: ['id', 'title', 'order', 'type'],
                include: [
                    {
                        model: models.PageLink,
                        required: false,
                        attributes: ['link']
                    }
                ]
            }
        ]
    }).then(function(results){
        models.NavigationElement.findOne({
            where: { title: req.params.page }
        }).then(function(ne){
            if(ne){
                models.NavigationSubElement.findOne({
                    where: {
                        title: req.params.subpage,
                        NavigationElementId: ne.id
                    }
                }).then(function(nse){
                    if(nse){
                        if(nse.type.localeCompare("CONTENT") == 0){
                            models.PageContent.findAll({
                                where: { NavigationSubElementId: nse.id }
                            }).then(function(pcs){
                                res.render("pages/commune", {
                                    structure: results,
                                    type: "CONTENT",
                                    content: pcs
                                });
                            }).catch(function(error){
                                console.log(error);
                            });
                        } else if(nse.type.localeCompare("LINK") == 0){

                        } else if(nse.type.localeCompare("LIST") == 0){
                            models.PageListElement.findAll({
                                where: { NavigationSubElementId: nse.id },
                                attributes: ["id", "illustration", "title", "description", "type"]
                            }).then(function(ples){
                                res.render("pages/commune", {
                                    structure: results,
                                    type: "LIST",
                                    list: ples
                                })
                            }).catch(function(error){
                                console.log(error);
                            });
                        }
                    } else {
                        next(); // 404
                    }
                }).catch(function(error){

                })
            } else {
                next(); // 404
            }
        }).catch(function(error){

        });
    }).catch(function(error){

    });
});

router.get('/:page', function(req, res, next){
    models.NavigationElement.findAll({
        ttributes: ['id', 'title', 'order'],
        order: [
            ['order', 'ASC'],
            [models.NavigationSubElement, 'order', 'ASC']
        ],
        include: [
            { 
                model: models.NavigationSubElement,
                required: false,
                attributes: ['id', 'title', 'order', 'type'],
                include: [
                    {
                        model: models.PageLink,
                        required: false,
                        attributes: ['link']
                    }
                ]
            }
        ]
    }).then(function(results){
        models.NavigationElement.findOne({
            where: { title: req.params.page }
        }).then(function(ne){
            if(ne){
                models.NavigationSubElement.findOne({
                    where: {
                        title: req.params.page,
                        NavigationElementId: ne.id
                    }
                }).then(function(nse){
                    if(nse){
                        if(nse.type.localeCompare("CONTENT") == 0){
                            models.PageContent.findAll({
                                where: { NavigationSubElementId: nse.id }
                            }).then(function(pcs){
                                res.render("pages/commune", {
                                    structure: results,
                                    type: "CONTENT",
                                    content: pcs
                                });
                            }).catch(function(error){
                                console.log(error);
                            });
                        } else if(nse.type.localeCompare("LINK") == 0){
                            next();
                        } else if(nse.type.localeCompare("LIST") == 0){
                            models.PageListElement.findAll({
                                where: { NavigationSubElementId: nse.id }
                            }).then(function(ples){
                                res.render("pages/commune", {
                                    structure: results,
                                    type: "LIST",
                                    list: ples
                                })
                            }).catch(function(error){
                                console.log(error);
                            });
                        }
                    } else {
                        next(); // 404
                    }
                }).catch(function(error){

                })
            } else {
                next(); // 404
            }
        }).catch(function(error){

        });
    }).catch(function(error){

    });
});

router.get('/', function(req, res, next){
   res.redirect("/accueil")
});

module.exports = router;