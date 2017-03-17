"use strict";
var Studio = require('studio');
var reddit = require('./reddit');


var redditUser = Studio.module('RedditUser');

redditUser(function * fetch(user){
	var redditResponse = yield reddit('/user/'+user+'/comments').get();
	
	console.log( 		{posts: redditResponse.data.children} );
	return {

	};
});
