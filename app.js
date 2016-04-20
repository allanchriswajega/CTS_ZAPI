var express =require('express');
var app = express();
var path = require('path');
var passport =require('passport');
var passportLocal =require('passport-local');
var bodyParse =require('body-parser');
var cookieParser =require('cookie-parser');
var expressSession =require('express-session');

//Public directory
app.use(express.static(path.join(__dirname, 'public')));

//mongo database

var mongoose = require('mongoose/');

mongoose.connect('mongodb://cts:cts123@104.197.33.187:27017/cts');
var Schema = mongoose.Schema;
var UserDetail = new Schema({
      username: String,
      password: String
    }, {
      collection: 'userInfo'
    });
var UserDetails = mongoose.model('userInfo', UserDetail);



//engine
app.set('view engine','ejs');


//User niddlewware
app.use(bodyParse.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(expressSession({secret: process.env.SESSION_SCRET || 'secret',
resave: false,
saveUninitialized: false
}));

//registering the passport middleware
app.use(passport.initialize());
app.use(passport.session());

//using the local strategy of passport------USERNAME AND PASSWORD
passport.use(new passportLocal.Strategy(function(username, password, done){

  process.nextTick(function() {
    UserDetails.findOne({
      'username': username, 
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (user.password != password) {
        return done(null, false);
      }

      return done(null, user);
    });
  });

}));
//serialising the user
passport.serializeUser(function(user, done){
	done(null, user.id);
});

//deserialising the user
passport.deserializeUser(function(id, done){
	//query db
	done(null, {id: id, name: id});
});

//route to the main page
app.get('/', function(req,res){
	res.render('index',{isAuthenticated:req.isAuthenticated(),
		user:req.user
	});

});

//route to the login page
app.get('/login',function(req,res){
	res.render('login');	
});

//login for post method
app.post('/login', passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/loginFailure'
  })
);

//login Failure
app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

//logout
app.get('/logout', function(req, res){
req.logout();
res.redirect('/');


});

//app port
var port = process.env.PORT || 8080;


app.listen(port, function(){
 console.log('http://localhost'+port+'/');
});