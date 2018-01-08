var express = require('express');
var router = express.Router();
var connection = require('../mysqlConnection');
var moment = require('moment');

router.get('/', function(req, res, next) {
  var query = 'SELECT * FROM phrases';
  connection.query(query, function(err, rows) {
    if(err){
      res.status(500).send({ error: err });
    }else{
      res.json(rows);
    }
  });
});

router.post('/',function(req,res){
  var phrase = req.body.phrase;
  var episode = req.body.episode;
  if(phrase.indexOf('　') == 0){
    phrase = phrase.substr(1);
  }
  if(phrase.indexOf(' ') == 0){
    phrase = phrase.substr(1);
  }
  if(phrase.lastIndexOf(' ') == phrase.length-1){
    phrase = phrase.substr(0,phrase.lastIndexOf(' '));
  }
  if(phrase.lastIndexOf('。') == phrase.length-1){
    phrase = phrase.substr(0,phrase.lastIndexOf('。'));
  }
  var getParams = [phrase,episode];
  var getQuery = 'SELECT phrase FROM phrases WHERE  phrase = ? AND episode = ?';
  
  connection.query(getQuery, getParams, function(err, rows) {
    if(err){
      console.log(err);
      res.status(500).send({ error: err });
    }else{
      var createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
      if(rows.length > 0){
        var postParams = [createdAt,phrase];
        var postQuery = 'UPDATE phrases SET count = count + 1, update_at = ? WHERE phrase = ?';
        connection.query(postQuery, postParams, function(err, rows2) {
          if(err){
            res.status(500).send({ error: err });
          }else{
            res.sendStatus(204);
          }
        });
      }else{
        var postParams = [createdAt,createdAt,phrase,episode];
        var postQuery = 'INSERT INTO phrases (created_at, update_at, phrase, episode) VALUES (?,?,?,?)';
        connection.query(postQuery, postParams, function(err, rows2) {
          if(err){
            res.status(500).send({ error: err });
          }else{
            res.sendStatus(201);
          }
        });
      }
    }
  });
})

module.exports = router;
