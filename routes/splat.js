"use strict";

var fs = require('fs'),
    // path is "../" since splat.js is in routes/ sub-dir
    config = require(__dirname + '/../config'),  // port#, other params
    express = require("express"),
    url = require("url");

// Implemention of splat API handlers:

// "exports" is used to make the associated name visible
// to modules that "require" this file (in particular app.js)

// heartbeat response for server API
exports.api = function(req, res){
    res.status(200).send('<h3>Eatz API is running!</h3>');
};

// retrieve an individual movie model, using it's id as a DB key
exports.getMovie = function(req, res) {
    MovieModel.findById(req.params.id, function(err, movie) {
        if (err) {
            res.status(500).send("Sorry, unable to retrieve movie at this time (" 
                +err.message+ ")" );
        } else if (!movie) {
            res.status(404).send("Sorry, that movie doesn't exist; try reselecting from Browse view");
        } else {
            res.status(200).send(movie);
        }
    });
};

exports.getMovies = function(req, res) {
    MovieModel.find(function(error, movies) {
        if (!error) {
            res.status(200).send(movies);
        } else {
            res.status(404).send("Sorry, no movies found " + 
                error.message);
        }
    });
};

exports.addMovie = function(req, res) {
    MovieModel.findById(req.params.id, function(err, movie) {
        if (!error) {
            res.status(200).insert(movie);
        } else {
            res.status(404).send("Sorry, cannot add movie " +
                error.message);
        }
    });
};

// NOTE, you would use this module only if you chose to implement
// image upload using Blobs with the HTML5 API.  If instead your
// server saves images directly from your model's poster value,
// you do NOT need this route handler

// upload an image file; returns image file-path on server
/*
exports.uploadImage = function(req, res) {
    // req.files is an object, attribute "file" is the HTML-input name attr
    var filePath = req.files. ...   // ADD CODE to get file path
        fileType = req.files. ...   // ADD CODE to get MIME type
        // extract the MIME suffix for the user-selected file
        suffix = // ADD CODE
        // imageURL is used as the value of a movie-model poster field 
    // id parameter is the movie's "id" attribute as a string value
        imageURL = 'img/uploads/' + req.params.id + suffix,
        // rename the image file to match the imageURL
        newPath = __dirname + '/../public/' + imageURL;
    fs.rename(filePath, newPath, function(err) {
        if (!err) {
            res.status(200).send(imageURL);
        } else {
            res.status(500).send("Sorry, unable to upload poster image at this time (" 
                +err.message+ ")" );
    }
    });
};
*/

var mongoose = require('mongoose'); // MongoDB integration

// Connect to database, using credentials specified in your config module
mongoose.connect('mongodb://' +config.dbuser+ ':' +config.dbpass+
                '@10.15.2.164/' + config.dbname);

// Schemas
var MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    released: { type: Number, required: true },
    director: { type: String, required: true },
    starring: { type: [String], required: true },
    rating: { type: String, required: true },
    duration: { type: Number, required: true },
    genre: { type: [String], required: true },
    synopsis: { type: String, required: true },
    freshTotal: { type: Number, required: true },
    freshVotes: { type: Number, required: true },
    trailer: { type: String },
    poster: { type: String, required: true },
    dated: { type: Date, required: true }
});

// Constraints
// each title:director pair must be unique; duplicates are dropped
//MovieSchema.index(...);  // ADD CODE

// Models
var MovieModel = mongoose.model('Movie', MovieSchema);