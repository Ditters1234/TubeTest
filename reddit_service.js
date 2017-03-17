"use strict";
var Studio = require('studio');
var reddit = require('./reddit');
// load youtube module, we will need it to fetch the video data
var youtubeModule = Studio.module('Youtube');
/*
If you pass a string to the module function it is going to return a reference for that service
*/
var fetchFromYoutube = youtubeModule('fetch');
//Now we create the Reddit class for our services
class Reddit{
	fetchSubreddit(path){
	  //fetch data from subreddit path
		return reddit('/domain/www.youtube.com/'+path).get();	
	}
	* searchForContent(path){
	  /*
	  As we are using a service class we can use this.ANY_METHOD and studio will call this service for you
	  and dont forget about the meaning of yield
	  */
		var redditResponse = yield this.fetchSubreddit(path);
		//reading the response
		var redditVideoInfo = redditResponse.data.children;
		//calling Youtube fetch for all url and storing in an array
		var fetchPromises = redditVideoInfo.map((info)=>fetchFromYoutube(info.data));
		//waiting for all promises to execute (yes, you can yield an array of promises for concurrency)
		var videosInfo = yield fetchPromises;
    //remove all nulls
		return videosInfo.filter((info)=> info!==null);
		
	}
}
/*
Studio.serviceClass receives a class as parameter and returns an instance of this class
and loads all their functions as studio services, it also uses the name of the class as namespace
we could have used this for Youtube service i just wanted to show both options
*/
Studio.serviceClass(Reddit);