var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var common = require('./routes/commune');
var test = require('./routes/test');
var admin = require('./routes/admin');
var models = require("./models");

var app = express();

models.sequelize.sync({ force: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public/images", express.static("public/images"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'persopaulbrousse2018' }));
app.use(function(req, res, next){
    if(req.session.visited || req.xhr){
        next();
    } else {
        models.Visits.findOne({
            where:{
                name: "VisitsCounter"
            }
        }).then(function(counter){
            counter.number = counter.number + 1;
            counter.save().then(function(){
                req.session.visited = 1;
                next();
            }).catch(function(error){
                console.log(error);
            });
        }).catch(function(error){
            console.log(error);
        });
    }
});

app.use('/test', test);
app.use('/admin', admin);
app.use('/', common);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
        models.SlideElement.findOne({
            where: {
                name: "Slideshow"
            }
        }).then(function(slideshow){
            if(slideshow){
                res.render("pages/404", {
                    structure: results,
                    slideshow: slideshow.content
                });
            } else {
                next();
            }
        }).catch(function(error){

        });
    }).catch(function(error){
    });
});

// error handler
app.use(function(err, req, res, next) {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
