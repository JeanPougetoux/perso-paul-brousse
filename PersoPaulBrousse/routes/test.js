var express = require('express');
var models = require('../models');
var router = express.Router();


router.get('/', function(req, res, next){
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
        console.log(JSON.stringify(results));
        req.session.navbar = results;
        res.render("pages/test", {
            structure: results 
        });
    }).catch(function(error){

    });
});

module.exports = router;