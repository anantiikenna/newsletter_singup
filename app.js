//jshint esversion:6

const express = require('express'),
bodyParser = require('body-parser'),
request = require('request');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + "/signup.html" );
});

app.post('/', function(req, res){
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;
  var data ={
    members: [
      {email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
    ]
  };
  var jsonData = JSON.stringify(data);

  const options = {
    url:'https://us10.api.mailchimp.com/3.0/lists/<LIST ID>',
    method: 'POST',
    headers:{
      'Authorization':'<username> <xxxxxAPI IDXXXXXXX>'
    },
    body: jsonData
  };

  request(options, function(error, reponse, body){
    if(error || reponse.statusCode != 200 ){
      // console.log(reponse.statusCode);
      res.sendFile(__dirname + '/failure.html');
    }
    else{
      if (reponse.statusCode === 200){
        // console.log(reponse.statusCode);
        res.sendFile(__dirname + '/success.html');
      }
      else{
        // console.log(reponse.statusCode);
        res.sendFile(__dirname + '/failure.html');
      }
    }
  });

});

app.post('/failure', function(req, res){
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function(){
  console.log('Server is running at port 3000');
});
