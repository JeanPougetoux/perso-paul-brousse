var express = require('express');
var models = require('../models');
var sequelize = require('sequelize');
var router = express.Router();
var Op = sequelize.Op;

router.get('/search/:text', function(req, res, next) {
    models.PageContent.findAll({
        attributes: ['content'],
        where: { content: { [Op.like]: '%' + req.params.text + '%' }},
        include: [{
            model: models.NavigationSubElement,
            attributes: ['title'],
            required: true,
            include: [{
                model: models.NavigationElement,
                attributes: ['title'],
                required: true
            }]
        }]
    }).then(function(contents){
	var processedResults = [];
        contents.forEach(content => {
            if(content.NavigationSubElement.title === content.NavigationSubElement.NavigationElement.title) {
                processedResults.push({text: content.content, url: "/" + content.NavigationSubElement.title, type: "CONTENT"});
            }
            else {
                processedResults.push({text: content.content, url: "/" + content.NavigationSubElement.NavigationElement.title + "/" + content.NavigationSubElement.title, type: "CONTENT"});
            }
        });
        models.PageListElement.findAll({
            attributes: ['id', 'title', 'description', 'content', 'type'],
            where: { 
                [Op.or]: [ 
                    { description: { [Op.like]: '%' + req.params.text + '%' } }, 
                    { content: { [Op.like]: '%' + req.params.text + '%' } }, 
                    { title: { [Op.like]: '%' + req.params.text + '%' } } 
                ] 
            },
            include: [{
                model: models.NavigationSubElement,
                attributes: ['title'],
                required: true,
                include: [{
                    model: models.NavigationElement,
                    attributes: ['title'],
                    required: true
                }]
            }]
        }).then(function(list){	
	list.forEach(element => {
                var text = "";
                if(element.title.toUpperCase().includes(req.params.text.toUpperCase())) {
                    text = element.title;
                }
                else if(element.description.toUpperCase().includes(req.params.text.toUpperCase())) {
                    text = element.description;
                }
                else if(element.content.toUpperCase().includes(req.params.text.toUpperCase())) {
                    text = element.content;
                }
                processedResults.push(
                    {
                        text: text, 
                        url: element.type === "LINK" ? element.content : "/" + element.NavigationSubElement.NavigationElement.title + "/" + element.NavigationSubElement.title + "/" + element.id, 
                        type: element.type
                    });
            });
            return res.status(200).json({'success': processedResults});
        }).catch(function(error){
            console.log(error);
        });
    }).catch(function(error){
        console.log(error);
    });
});

router.post('/adhere', function(req, res, next){
    if(req.body.firstname == "" || req.body.lastname == "" || req.body.service == "" || req.body.email == "" || req.body.phone == ""){
        return res.status(500).json({'error': "Une ou plusieurs informations sont manquantes !"});
    } 
    models.Adhesions.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        service: req.body.service,
        email: req.body.email,
        telephone: req.body.phone
    }).then(function(adhesion){
        return res.status(200).json({'success': "Votre demande d'adhésion a bien été reçue !"});
    }).catch(function(error){
        return res.status(500).json({'error': "Une erreur est survenue !"});
    })
});

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
                                models.SlideElement.findOne({
                                    where: {
                                        name: "Slideshow"
                                    }
                                }).then(function(slideshow){
                                    if(slideshow){
                                        res.render("pages/commune", {
                                            structure: results,
                                            type: "ARTICLE",
                                            content: article.content,
                                            slideshow: slideshow.content,
                                            page: req.params.page
                                        });
                                    } else {
                                        next();
                                    }
                                }).catch(function(error){

                                });
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
                        models.SlideElement.findOne({
                            where: {
                                name: "Slideshow"
                            }
                        }).then(function(slideshow){
                            if(slideshow){
                                if(nse.type.localeCompare("CONTENT") == 0){
                                    models.PageContent.findAll({
                                        where: { NavigationSubElementId: nse.id }
                                    }).then(function(pcs){
                                        res.render("pages/commune", {
                                            structure: results,
                                            type: "CONTENT",
                                            content: pcs,
                                            slideshow: slideshow.content,
                                            page: req.params.page
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
                                        models.PageContent.findOne({
                                            where: { NavigationSubElementId: nse.id }
                                        }).then(function(pc){
                                            if(pc){
                                                res.render("pages/commune", {
                                                    structure: results,
                                                    type: "LIST",
                                                    list: ples,
                                                    header: pc.content,
                                                    slideshow: slideshow.content,
                                                    page: req.params.page
                                                });
                                            } else {
                                                next();
                                            }
                                        }).catch(function(error){

                                        });
                                    }).catch(function(error){
                                        console.log(error);
                                    });
                                }
                            } else {
                                next();
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

router.get('/:page', function(req, res, next){
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
                        title: req.params.page,
                        NavigationElementId: ne.id
                    }
                }).then(function(nse){
                    if(nse){
                        models.SlideElement.findOne({
                            where: {
                                name: "Slideshow"
                            }
                        }).then(function(slideshow){
                            if(slideshow){
                                if(nse.type.localeCompare("CONTENT") == 0){
                                    models.PageContent.findAll({
                                        where: { NavigationSubElementId: nse.id }
                                    }).then(function(pcs){
                                        res.render("pages/commune", {
                                            structure: results,
                                            type: "CONTENT",
                                            content: pcs,
                                            slideshow: slideshow.content,
                                            page: req.params.page
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
                                        models.PageContent.findOne({
                                            where: { NavigationSubElementId: nse.id }
                                        }).then(function(pc){
                                            if(pc){
                                                res.render("pages/commune", {
                                                    structure: results,
                                                    type: "LIST",
                                                    list: ples,
                                                    header: pc.content,
                                                    slideshow: slideshow.content,
                                                    page: req.params.page
                                                });
                                            } else {
                                                next();
                                            }
                                        }).catch(function(error){

                                        });
                                    }).catch(function(error){
                                        console.log(error);
                                    });
                                }
                            } else {
                                next();
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

router.get('/', function(req, res, next){
    res.redirect("/accueil")
});

module.exports = router;
