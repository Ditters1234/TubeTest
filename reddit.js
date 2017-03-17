var Snoocore = require('snoocore');
var config  = require('config.json')('./test.json');

var snoocoreFactory = function(){
  return new Snoocore({
    userAgent: 'User-Agent: TubeTest:v1.0.0', // unique string identifying the app
	oauth: {
	  type: 'script',
	  key: config.redditClient,
	  secret: config.redditSecret,
	  username: config.redditUser,
	  password:config.redditPass,
	  scope: [ 'identity', 'read', 'history' ]
	}
  });
};
var reddit = snoocoreFactory();

reddit.on('access_token_expired', function(responseError) {
  console.log('access_token_expired');
  reddit  = snoocoreFactory();
});
module.exports = reddit;
