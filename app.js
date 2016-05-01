
//****************************************HEADER *****************************************************************
//****************************************************************************************************************
//****************************************************************************************************************
//****************************************************************************************************************
// -------------------INNITAL SET UP OF SERVER -----------------------------------
var express =require('express');
var app = express();
var server = require('http').createServer(app);
// SOCKET.IO
var io = require('socket.io').listen(server);

var path = require('path');
var passport =require('passport');
var passportLocal =require('passport-local');
var bodyParse =require('body-parser');
var cookieParser =require('cookie-parser');
var expressSession =require('express-session');
//for parsing aircraft data
var url = require('url');
//-------------------- END OF CODE -------------------------------------------------


//--------------------Public directory------------------------------------
app.use(express.static(path.join(__dirname, 'public')));


//engine
app.set('view engine','ejs');
//------------------------- END OF CODE --------------------------------------------------


//-------------------APP MIDDLE WARE --------------------------------------
app.use(bodyParse.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(expressSession({secret: process.env.SESSION_SCRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
//-------------------END OF CODE -----------------------------------------


//-------------------mongo database---------------------------------------
var mongoose = require('mongoose/');
mongoose.connect('mongodb://cts:cts123@104.197.33.187:27017/cts');
//mongoose.connect('mongodb://127.0.0.1:27017/cts');
var Schema = mongoose.Schema;
var UserDetail = new Schema({
      username: String,
      password: String  
    }, {
      collection: 'userInfo'
    });
var UserDetails = mongoose.model('userInfo', UserDetail);
//---------------------------END OF CODE --------------------------------------

 //------------CLIENT DATA SCHEMA-----------------------------
          var Client_data_Schema = new Schema({
                lg : String,
                le : String,
                spd : String,
                pres : String,
                vol : String,
                cd_code : String,
                cd_time: String
                });

          //2. Create usermodel
          var Client_new_model = mongoose.model('client_data', Client_data_Schema);
//--------------------END ----------------------------------------




//-------------------------PASSPORT AUTHENTICATION FRAMEWORK--------------------------------
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
//-------------------------------- END OF CODE -----------------------------------
//*********************************************************************************************************************
//*********************************************************************************************************************
//*********************************************************************************************************************
//*********************************************************************************************************************


//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
//**********************************WORKING WITH SOCKET.IO***********************************8********
//********************************************************************************************************
//********************************************************************************************************
//1. when the server gets a connection
io.sockets.on('connection', function(socket){

    console.log('Server got a new connection');

    io.sockets.emit('welcome','welcome to the cts the online control server');

//recieved  data from clients
    socket.on('new data', function(data)
    {
        io.sockets.emit('hello');

    });

    //recieved a ping request
    socket.on('ping', function(data){
       io.sockets.emit('ping', 'hello');

    });




    //-------------------Authentication Request ----------------------------------
    socket.on('auth', function (data){
        var obj = JSON.parse(JSON.stringify(data));

        if ((obj.uname ==="wac") && (obj.pword ==="wac")){
            io.sockets.emit('auth_sucess','null');
            //...............................Sending Intial Data to the the connected user ..........................
            Client_new_model.find(function (err, data){
                if (err){
                    console.error(err);
                }
                else
                {
                    //console.error(JSON.parse(JSON.stringify(data)));
                    //io.sockets.emit('welcome','wajega!!!');

                    //sending intial data
                    io.sockets.emit('init_data',JSON.parse(JSON.stringify(data)));

                }

            });

            //**********************************************************************************
        }
        else
        {
            io.sockets.emit('auth_fail','null');

        }

    });
    //-----------------------END OF CODE -----------------------------------------



    io.sockets.emit('send_plane_data','now')  ;



    //------------------------------------On New data from plane -------------------
    socket.on('new_plane_data', function(data){

        var obj = JSON.parse(JSON.stringify(data));


        //----------------Saving the recieved data into the data base-----------------------------

        //client_data_variable
        var New_client_data = new Client_new_model(obj);

        //Saving into the database
        New_client_data.save(function (err, data){
            if (err){
                console.log(err);
            }
            else {
                console.log('Saved : ', data );

            }

        });

        //emiting the recieved data to the client
        io.sockets.emit('new_data',obj);

        setInterval(function () {
            io.sockets.emit('send_plane_data','now')  ;
        }, 10000);


        //--------------------------END OF CODE------------------------------------------------------

    });
    //----------------------------------- END OF CODE -------------------------------
});
//********************************************************************************************************
//********************************************************************************************************
//********************************************************************************************************
//********************************************************************************************************





//************************************** ROUTINGS ********************************************************************
//********************************************************************************************************
//********************************************************************************************************
//-----------------------------route to the main page----------------------------------------------------
app.get('/', function(req,res){

	res.render('index',{isAuthenticated:req.isAuthenticated(),
		user:req.user     
	});

     

});
//-------------------------------END OF CODE--------------------------------------------------------------

//----------------------------------USERS PAGE ---------------------------------------------------------
app.get('/users', function(req,res){
    res.render('users');

});


//-------------------------------- END OF CODE ---------------------------------------------------------


//----------------------------------route to the login page------------------------------------------------
app.get('/login',function(req,res){
	res.render('login');	
});

//-------------------------------END OF CODE--------------------------------------------------------------

//--------------------------login for post method---------------------------------------------------------
app.post('/login', passport.authenticate('local',{
    successRedirect: '/loginSucess',
    failureRedirect: '/loginFailure'
  })
);
//--------------------------- END OF CODE -----------------------------------------------------------

//---------------------LOGIN SUcess------------------------------------------------------------------
app.get('/loginSucess', function(req, res, next) {
 
        res.redirect('/');

      
});

//----------------------END OF CODE ---------------------------------

//---------------------------login Failure---------------------------------------------------------------
app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});
//--------------------------END OF CODE -----------------------------------------------------------------

//---------------------------logout----------------------------------------------------------------
app.get('/logout', function(req, res){
req.logout();
res.redirect('/');
});
//-------------------------END OF CODE --------------------------------------------------------------

//---------------------------WORKING WITH THE AIRCRAFT SYSTEMS ----------------------------------
app.get('/client', function(req, res){
    var otherObject ={sM:"W",AR:"",Ws:"2"};
    var json = JSON.stringify(otherObject);
    var queryData = url.parse(req.url, true).query;


    //checking for the action
    console.log("Action..."+queryData.action);
    if (queryData.action === "auth")
    {

        if ((queryData.uname === "wac") && (queryData.pword === "wac"))
        {

            console.log("-----RECHED HIA-------");
            io.sockets.emit('welcome','New Aircraft has loged onto the system');
            io.sockets.emit('new_plane','we have a new plane');

            //inserting into the database with the Aircraft code      
         //**********************************************************************************
       
//...............................Sending Intial Data to the the connected user ..........................
      Client_new_model.find(function (err, data){
             if (err){
                 console.error(err);
                    }
                  else
                 {
                console.error(JSON.parse(JSON.stringify(data)));
                     io.sockets.emit('welcome','wajega!!!');

                      //sending intial data
                      io.sockets.emit('init_data',JSON.parse(JSON.stringify(data)));

                 }
                 
               });
     
       //**********************************************************************************

            res.end(json);

        }
        else
        {
            console.log(queryData.uname );

            res.end("Access Denied!!!\n");
            io.sockets.emit('welcome','Aircraft has been denied access to the system!!!');


        }

    }

    //Data Uploaded from the server
    else if (queryData.action === "DataUpload")
    {
        var cdata ={lg:queryData.lg,le:queryData.le,spd:queryData.speed,alt:queryData.altitude,pre:queryData.pressure,vol:queryData.voltage,cd_code:"Wac123"};
        var otherObject ={sM:"W",AR:"",Ws:"2"};
        var json = JSON.stringify(otherObject);
        var obj = JSON.parse(JSON.stringify(cdata));
        console.log("Parsed data!!!!");
        console.log("Current Aircraft longitude..."+obj.lg);
        console.log("Current Aircraft latitude..."+obj.le);
        console.log("Current Aircraft speed..."+obj.spd);
        console.log("Current Aircraft altitude..."+obj.alt);
        console.log("Current Aircraft pressure..."+obj.pre);
        console.log("Current Aircraft Voltage..."+obj.vol);

        io.sockets.emit('welcome','have recieved new data from Aircraft!!');





        //Displaying the already stored data in the database
        Client_new_model.find(function (err, data){
            if (err){
                console.error(err);
            }
            else
            {
                console.error(JSON.parse(JSON.stringify(data)));


            }
        });


          //client_data_variable
          var New_client_data = new Client_new_model(obj);

          //Saving into the database
          New_client_data.save(function (err, data){
            if (err){
                    console.log(err);
            }
            else {
                console.log('Saved : ', data );

            }

          });






        io.sockets.emit('new_data',obj);

        res.end(json);


    }

    else {

        res.end("Hello,what do u want from the server????\n");

    }


});

//--------------------------END OF CODE ---------------------------------------------------

//******************************************************************************************************************
//******************************************************************************************************************
//******************************************************************************************************************
//******************************************************************************************************************



//app port
var port = process.env.PORT || 8081;

server.listen(port, function(){
 console.log('http://localhost'+port+'/');

});

