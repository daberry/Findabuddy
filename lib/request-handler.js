var db = require('./dbConfig');
var User = require('../models/users');
var BuddyRequest = require('../models/buddyRequest');

exports.getIndex = function(req,res) {
  if (req.session ? !!req.session.user : false) {
    res.render('index');
  } else {
    res.redirect('/login');
  }

};

exports.getProfile = function(req,res) {
	var username = req.body.username;
	User.find({username: username}, function(err, data) {
		if (err) {
			res.status(500).send(err);
		}
		res.status(200).send(data);
	})
};

exports.getLogin = function(req,res) {
	res.render('login');
};

exports.postLogin = function(req,res) {
	//check if password matches the username
		//if so, error
		//if not, make new session and return and redirects to index
};

exports.getLogout = function(req,res) {
	//regenerate session and send as response
};

exports.getSignup = function(req,res) {
	res.render('signup');
};

exports.postSignup = function(req,res) {
	//check if user exists
		//if so, error
		//if not, make new session and return and redirects to index
};

exports.getBuddyRequest = function(req, res) {
  //http://www.zipcodeapi.com/API#distance
  // 50 api requests per hour
  console.log(req.body, req.query, typeof req.query.age);
  var query = BuddyRequest;

  if (typeof req.query.age === 'string') {
    var parsed = JSON.parse(req.query.age);
    delete req.query.age;
    var keys = Object.keys(parsed);
    keys.map(function(cur) {
      var params = ['$gte', '$lte', '$lt', '$gt'];
      params.map(function(curParam) {
        if (cur === curParam) {
          console.log('key is ',cur, parsed[cur],typeof parsed[cur]);
          var trimmedCur = cur.slice(1);
          query = query.where('age')[trimmedCur](parsed[cur]);
        }
      });
    });
    query = query.find(req.query);
  }
  query.exec(function(err,results) {
    if (err) { console.error(err); }
    console.log(err,results);
    res.status(200).send(results);
  });
/*

    // {name: 'alex', zipcode: '{$gte: 90000}'}
    req.query.zipcode = JSON.parse(req.query.zipcode);
    delete req.query.zipcode
    console.log(req.query);

  } else {
    var query = BuddyRequest.find(req.query);
  }
  var promise = query.exec();
  promise.addBack(function (err, docs) {
    if (err) { console.error(err); }
    //console.log(docs);
    res.status(200).send(docs);
  });
  */

};

exports.postBuddyRequest = function(req, res) {
  console.log('request body: ',req.body);
  new BuddyRequest(req.body).save()
  .then(
  	function() {
      res.status(201).send();
    }
  )
  .catch(
    function(err) {
    	console.error(err);
    }
  );
};

exports.get404 = function(req,res) {
	res.status(404);
	res.send();
};