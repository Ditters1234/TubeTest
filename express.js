var Studio = require('studio');
var express = require('express');
var app = express();
//Get Reddit module and then the reference for the searchForContent service
var searchForContent = Studio.module('Reddit')('searchForContent');

app.get('/:path', function (req, res) {
  /*
  Call the service, remember, every service call returns a promise
  */
  searchForContent(req.params.path).then((result)=>{
  	res.send(result);
  }).catch((error)=>{
  	console.log(error);
  	res.send(error);
  });
});

app.listen(3000,function(err){
	console.log('Server listening at http://localhost:3000');
});