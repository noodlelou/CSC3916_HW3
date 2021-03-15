/*
CSC3916 HW3
File: Server.js
Description: Web API scaffolding for Movie API
 */

require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');
const { db } = require('./Movies');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovie(req) {
    var json = {
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    return json;
}

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

router.get('/movies', (req, res) => {
    //const movie = await Movie.find({});

    //req = getJSONObjectForMovie(req);

    const movie = db.collection('movies').findOne({Title: req.body.Title});

    try{
        res.send(movie);
    } catch(err) {
        res.status(500).send(err);
    }

});

router.post('/movies', (req, res) => {

    //req = getJSONObjectForMovie(req);

    const movie = new Movie(req.body);

    try{
        movie.save();
        res.send(movie);
    } catch(err) {
        res.status(500).send(err);
    }
});

router.put('/movies/:id', (req, res) => {
    try {
        const movie = Movie.findByIdAndUpdate(req._id, req.body)
        movie.save()
        res.send(movie)
    } catch (err) {
        res.status(500).send(err)
    }
});

router.delete('/movies/:id', (req, res) => {
    try {
        const movie = Movie.findByIdAndDelete(req._id);

        if (!movie) res.status(404).send("No item found");
        res.status(200).send()

    } catch (err) {
        res.status(500).send(err)
    }

});


app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


