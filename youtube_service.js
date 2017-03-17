"use strict";
//We  need use strict because of es6 features
var Studio = require('studio');
var request = require('request');
var config  = require('config.json')('./test.json');
var reddit = require('./reddit');

var YOUTUBE_KEY = config.googleAPI;
var YOUTUBE_REGEX = /https:\/\/www.youtube.com\/watch\?v=(\w*)/;//basic regex to get youtube id
/*
Studio.module creates or retrieves a module it is just a wrapper on your services
to avoid name collision on big projects
*/
var youtubeModule = Studio.module('Youtube');
/*
The module object accepts 2 different arguments, if you pass a named function as the code below it
will create a service with that name
*/


youtubeModule(function * fetch(data){
	var match = YOUTUBE_REGEX.exec(data.url); //search for id
	if(match && match[1]){ // if we find the id the we fetch data on youtube
		let id = match[1];
		//"wait" for the response from youtube
		let youtubeResponse = yield request(`https://www.googleapis.com/youtube/v3/videos?id=${id}&part=snippet&key=${YOUTUBE_KEY}`, Studio.defer());
		let body = JSON.parse(youtubeResponse.body);
		let itemsResult = body.items;
		
		let redditUserComments = (yield reddit('/user/'+data.author+'/comments').get()).data.children;
		var redditComments = Object.keys(redditUserComments ).length
		if(redditComments == 25) redditComments = '25+';
		
		let redditUserSubmits = (yield reddit('/user/'+data.author+'/submitted').get()).data.children;
		var redditSubmits = Object.keys(redditUserSubmits ).length
		if(redditSubmits == 25) redditSubmits = '25+';		
		
		if(itemsResult && itemsResult.length>0){
			let info = itemsResult[0];
			return {
				reddit_user: data.author,
				reddit_user_comment_count: redditComments,
				reddit_user_submitted_count: redditSubmits,
				reddit_permalink: 'https://www/reddit.com'+data.permalink,
				reddit_posted_at: new Date(data.created_utc *1000),
				reddit_title: data.title,
				
				youtube_link: data.url,
				youtube_posted_at: new Date(Date.parse(info.snippet.publishedAt.replace(/ *\(.*\)/,""))),
				youtube_title:info.snippet.title,
				youtube_description:info.snippet.description,


				youtube_to_reddit_time: Math.round((new Date(data.created_utc *1000) - new Date(Date.parse(info.snippet.publishedAt.replace(/ *\(.*\)/,"")))) / (1000 * 60)),
				//reddit_FULL: data,
				//youtube_FULL: info.snippet,
				
			};
		}
	}
	return null; // return null if is not an youtube url or we have no results
});