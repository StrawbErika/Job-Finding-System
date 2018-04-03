var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
const db = require('./db/db');
var PDFDocument = require('pdfkit');
var fs = require('fs');

var app = express();
var currentuser;
var currentprof;
var currentusername;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', index);
app.use('/users', users);


app.get('/',function(req,res){  //accept request from client then send the webpage if 200 OK
  res.sendfile("home.ejs");
});

app.get('/welcome',function(req,res){
  res.sendfile("sample.ejs");
});


app.post('/homepage',function(req,res){ //accept client request
  res.send('done');
});

app.post('/getcompany',function(req,res){ //accept client request
   db.query('select * from COMPANY_PROFILE NATURAL JOIN COMPANY_USER;', function (error, results, fields){
    if (error) throw error;
    
    
    res.send(results);
    res.end("yes");

  });
 });

app.post('/getnotapprovedcompany',function(req,res){ //accept client request
   db.query('select * from COMPANY_PROFILE NATURAL JOIN COMPANY_USER where Is_approved = 0;', function (error, results, fields){
    if (error) throw error;
    
    
    res.send(results);
    res.end("yes");

  });
 });

app.post('/getalljobseeker',function(req,res){ //accept client request
   db.query('select * from JOB_SEEKER_USER natural join JOB_SEEKER_PROFILE;', function (error, results, fields){
    if (error) throw error;
    
    
    res.send(results);
    res.end("yes");

  });
 });

app.post('/getalljobseekertoapply',function(req,res){ //accept client request
   db.query('SELECT * FROM JSPROFILE_APPLIES_FOR_JOB NATURAL JOIN JOB_SEEKER_PROFILE NATURAL JOIN JOB_SEEKER_USER', function (error, results, fields){
    if (error) throw error;
    
    
    res.send(results);
    res.end("yes");

  });
 });

app.post('/getalljobsubmitted',function(req,res){ //accept client request
   db.query('SELECT * FROM JOB where C_userid = ' + currentuser +' ;', function (error, results, fields){
    if (error) throw error;
    
    
    res.send(results);
    res.end("yes");

  });
 });

app.post('/jobseekergetalljobs',function(req,res){ //accept client request
   db.query('SELECT * FROM JOB;', function (error, results, fields){
    if (error) throw error;
    
    
    res.send(results);
    res.end("yes");

  });
 });

app.post('/getalljobseekertoapplytojob',function(req,res){ //accept client request
   db.query('SELECT * FROM JOB_SEEKER_USER NATURAL JOIN JOB_SEEKER_PROFILE NATURAL JOIN JSPROFILE_APPLIES_FOR_JOB NATURAL JOIN JOB where C_userid = ' + currentuser + ';', function (error, results, fields){
    if (error) throw error;
    
    
    res.send(results);
    res.end("yes");

  });
 });

app.post('/adminlogin',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  var qpass;
  var quser;
  console.log("User name = "+user_name+", password is "+password);

 db.query('select a.Password, a.Username, b.Admin_id from USER a join ADMIN_USER b on a.Username = b.Username;', function (error, results, fields){
    if (error) throw error;
    var employees = JSON.stringify(results);
    var json = JSON.parse(employees);
    
    for (i = 0; i < json.length; i++) {
      if(user_name == json[i].Username){
          qpass = json[i].Password;
          quser = json[i].Username;
          currentuser = json[i].Admin_id;
          break;
      }
    } 
    
    if (user_name == quser && password == qpass){
      res.send("done");
    }
    else{
      res.send("error");
    }

    res.end("yes");

  });


 

});


app.post('/companylogin',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  var qpass;
  var quser;
  console.log("User name = "+user_name+", password is "+password);

 db.query('select * from USER NATURAL JOIN COMPANY_USER NATURAL JOIN COMPANY_PROFILE;', function (error, results, fields){
    if (error) throw error;
    var employees = JSON.stringify(results);
    var json = JSON.parse(employees);
    
    for (i = 0; i < json.length; i++) {
      if(user_name == json[i].Username){
          qpass = json[i].Password;
          quser = json[i].Username;
          currentuser = json[i].C_userid;
          currentusername = json[i].Username;
          currentprof = json[i].C_profileid;
          break;
      }
    } 
    
    res.send(qpass);

    res.end("yes");

  });


 

});

app.post('/jobseekerlogin',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  var qpass;
  var quser;
  console.log("User name = "+user_name+", password is "+password);

 db.query('select * from USER NATURAL JOIN JOB_SEEKER_USER NATURAL JOIN JOB_SEEKER_PROFILE;', function (error, results, fields){
    if (error) throw error;
    var employees = JSON.stringify(results);
    var json = JSON.parse(employees);
    
    for (i = 0; i < json.length; i++) {
      if(user_name == json[i].Username){
          qpass = json[i].Password;
          quser = json[i].Username;
          currentuser = json[i].Js_userid;
          currentusername = json[i].Username;
          currentprof = json[i].Js_profileid;
          break;
      }
    } 
    
    res.send(qpass);
    

    res.end("yes");

  });


 

});

app.post('/admindelete',function(req,res){
  var cid=req.body.id;
  db.query('delete from USER where Username = (select Username from COMPANY_USER where C_userid = ' +  cid + ');', function (error, results, fields){
    if (error) throw error;
    
  });

  db.query('delete from JOB where C_userid = (select C_userid from COMPANY_PROFILE where C_profileid = ' + cid + ');', function (error, results, fields){
    if (error) throw error;
    
  });

  db.query('delete from COMPANY_USER where C_userid = ' + cid +';', function (error, results, fields){
    if (error) throw error;
    
  });
  db.query('delete from CPROFILE_OFFERS_JOB where C_profileid = ' + cid +';', function (error, results, fields){
    if (error) throw error;
    
  });
    res.send("done");
    res.end("yes");
});

app.post('/adminapprove',function(req,res){
  var cid=req.body.id;
  db.query('update COMPANY_PROFILE set Is_approved = 1 where C_profileid = ' + cid + ';', function (error, results, fields){
    if (error) throw error;
    
  });
  db.query('update COMPANY_PROFILE set Date_approved = CURDATE() where C_profileid = ' + cid + ';', function (error, results, fields){
    if (error) throw error;
    
  });

    res.send("done");
    res.end("yes");
});

app.post('/companyadd',function(req,res){
  var street=req.body.street;
  var city=req.body.city;
  var province=req.body.province;
  
  db.query('INSERT INTO COMPANY_PROFILE (Date_submitted, Is_approved, Date_approved, Street, City, Province, C_userid) VALUES (CURDATE(), 0, NULL, \'' + street + '\', \'' + city  + '\', \'' +  province + '\', ' + currentuser + ');', function (error, results, fields){
    if (error) throw error;
    
  });
    res.send("done");
    res.end("yes");
});

app.post('/companyedit',function(req,res){
  var street=req.body.street;
  var city=req.body.city;
  var province=req.body.province;
  var name=req.body.name;
  var email=req.body.email;
  var cid=currentuser;
  if(cid.length == 0){
    res.send("error");
  }
  else{
    if(street.length > 0){
      db.query('update COMPANY_PROFILE set Street = \'' + street +  '\' where C_profileid = ' + currentprof + ';', function (error, results, fields){
        if (error) throw error;
        
      });
    }
    if(city.length > 0){
      db.query('update COMPANY_PROFILE set City = \'' + city +  '\' where C_profileid = ' + currentprof + ';', function (error, results, fields){
        if (error) throw error;
        
      });
    }
    if(province.length > 0){
      db.query('update COMPANY_PROFILE set Province = \'' + province +  '\' where C_profileid = ' + currentprof + ';', function (error, results, fields){
        if (error) throw error;
        
      });
    }
    if(name.length > 0){
      db.query('update COMPANY_USER set Name = \'' + name +  '\' where C_userid = ' + currentuser + ';', function (error, results, fields){
        if (error) throw error;
        
      });
    }
    if(email.length > 0){
      db.query('update COMPANY_USER set Email = \'' + email +  '\' where C_userid = ' + currentuser + ';', function (error, results, fields){
        if (error) throw error;
        
      });
    }
    res.send("done");
  }


    res.end("yes");
});

app.post('/companyview',function(req,res){ //accept client request
   db.query('select * from COMPANY_PROFILE NATURAL JOIN COMPANY_USER where C_userid = ' + currentuser + ';', function (error, results, fields){
    if (error) throw error;
    
    
    res.send(results);
    res.end("yes");

  });
 });

app.post('/jobseekercompanyview',function(req,res){ //accept client request
  var cid=req.body.cid;
  if(cid.length > 0){
	   db.query('select * from COMPANY_PROFILE NATURAL JOIN COMPANY_USER where C_userid = ' + cid + ';', function (error, results, fields){
	    if (error) throw error;
	    
	    
	    res.send(results);
	    res.end("yes");

	  });
	}
	else{
		res.send("error");
		res.end("yes");
	}
 });

app.post('/companycheckapproval',function(req,res){ //accept client request
  var cid=req.body.cid;
   db.query('select Is_approved from COMPANY_PROFILE NATURAL JOIN COMPANY_USER where C_userid = ' + currentuser + ';', function (error, results, fields){
    if (error) throw error;
    var id = JSON.stringify(results);
    var json = JSON.parse(id);
    res.send(json[0].Is_approved.toString());
    res.end("yes");

  });
 });

app.post('/companydelete',function(req,res){

  db.query('delete from JOB where C_userid = ' + currentuser + ';', function (error, results, fields){
    if (error) throw error;
    
  });
  db.query('delete from COMPANY_USER where C_userid = ' + currentuser +';', function (error, results, fields){
    if (error) throw error;
    
  });
  db.query('delete from CPROFILE_OFFERS_JOB where C_profileid = ' + currentuser +';', function (error, results, fields){
    if (error) throw error;
    
  });

  db.query('delete from USER where Username = \'' + currentusername +'\';', function (error, results, fields){
    if (error) throw error;
    
  });
    res.send("done");
    res.end("yes");
});

app.post('/companyviewjobseeker',function(req,res){ //accept client request
  var cid=req.body.cid;
  if(cid.length > 0){
	   db.query('select * from JOB_SEEKER_USER natural join JOB_SEEKER_PROFILE where Js_profileid = ' + cid + ';', function (error, results, fields){
	    if (error) throw error;
	    
	    
	    res.send(results);
	    res.end("yes");
	  });
	}
	else{
		res.send("error");
		res.end("yes");
	}
 });

app.post('/signup1',function(req,res){ //accept client request
  var name=req.body.name;
  var email=req.body.email;
  var username=req.body.username;
  var password=req.body.password;
  var street=req.body.street;
  var city=req.body.city;
  var province=req.body.province;
  db.query('insert into USER(Username, Password) values(\'' + username + '\', \'' + password +  '\');', function (error, results, fields){
    if (error) throw error;
    

  });
  db.query('insert into COMPANY_USER(Email, Name, Username) values(\'' + email + '\', \'' + name + '\', \'' + username + '\');', function (error, results, fields){
    if (error) throw error;
    

  });

  db.query('INSERT INTO COMPANY_PROFILE (Date_submitted, Is_approved, Date_approved, Street, City, Province, C_userid) VALUES (CURDATE(), 0, NULL, \'' + street + '\', \'' + city  + '\', \'' +  province + '\', ' + "(select C_userid from COMPANY_USER where Username = \"" + username + "\")" + ');', function (error, results, fields){
    if (error) throw error;
    
  });

   res.send("done");
   res.end("yes");
 });

app.post('/sample1',function(req,res){ //accept client request
    

   res.send("done");
   res.end("yes");
 });

app.post('/companycheckid',function(req,res){ //accept client request
  var jid=req.body.jid;
   db.query('select Job_id from JOB where C_userid = ' + currentuser + ';', function (error, results, fields){
    if (error) throw error;
    resq = JSON.stringify(results);
    resq = JSON.parse(resq);
    var i = 0;
    var exist = 0;
    while(i < resq.length){
      if(resq[i].Job_id == jid){
        exist = 1;
        break;
      }
      i++;
    }

    if(exist == 1){
        res.send("done");
    }
    else{
      res.send("error");
    }
    res.end("yes");

  });
 });

app.post('/postjob',function(req,res){ //accept client request
  var workhours = req.body.workhours;
  var salary = req.body.salary;
  var position = req.body.position;


  db.query('insert into JOB(Working_hours, Salary, Position, C_userid) values(\'' + workhours + '\', \'' + salary + '\', \'' + position + '\', ' + currentuser +');', function (error, results, fields){
    if (error) throw error;
    res.send("done");
    res.end("yes");
  });
  
 });

app.post('/editjob',function(req,res){ //accept client request
  var workhours = req.body.workhours;
  var salary = req.body.salary;
  var position = req.body.position;
  var jid = req.body.jid;
  console.log(workhours);
  if(workhours.length > 0){
    db.query('update JOB set Working_hours = \'' + workhours +  '\' where Job_id = ' + jid + ';', function (error, results, fields){
        if (error) throw error;
        
      });
  }
  if(salary.length > 0){
    db.query('update JOB set Salary = ' + salary +  ' where Job_id = ' + jid + ';', function (error, results, fields){
        if (error) throw error;
        
      });

  }
  if(position.length > 0){
    db.query('update JOB set Position = \'' + position +  '\' where Job_id = ' + jid + ';', function (error, results, fields){
        if (error) throw error;
        
      });

  }
  
  res.send("done");
  res.end("yes");
 });

app.post('/viewjob',function(req,res){ //accept client request
  var jid = req.body.jid;
  if(jid.length > 0){

  
	   db.query('SELECT * FROM JOB where Job_id = ' + jid + ';', function (error, results, fields){
	    if (error) throw error;
	    
	    
	    res.send(results);
	    res.end("yes");


	  });
	}
	else{
		res.send("error");
		res.end("yes");
	}
 });


app.post('/deletejob',function(req,res){
  var jid=req.body.jid;
  if(jid.length > 0){


	  db.query('delete from JOB where Job_id = ' + jid + ';', function (error, results, fields){
	    if (error) throw error;
	    
	  });
	  res.send("done");
    }
    else{
    	res.send("error");
    }

    res.end("yes");
});

app.post('/generatereport',function(req,res){
  var filename=req.body.filename;
  var content = req.body.content;

  var doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filename));
  doc.save().fontSize(14).text(content, 100, 100);
  doc.end();

  res.send("done");
  res.end("yes");
});

app.post('/jobseekeradd',function(req,res){
  var street=req.body.street;
  var city=req.body.city;
  var province=req.body.province;
  var email=req.body.email;
  
  db.query('INSERT INTO JOB_SEEKER_PROFILE (Email, Street, City, Province, Js_userid) VALUES (\'' + email  + '\', \'' + street + '\', \'' + city  + '\', \'' +  province + '\', ' + currentuser + ');', function (error, results, fields){
    if (error) throw error;
    
  });
    res.send("done");
    res.end("yes");
});

app.post('/jobseekeredit',function(req,res){
  var street=req.body.street;
  var city=req.body.city;
  var province=req.body.province;
  var name=req.body.name;
  var email=req.body.email;
  var birthday=req.body.birthday;
  var sex=req.body.sex;
  var email=req.body.email;
  var jid=currentuser;
  console.log(currentuser + "    " + currentprof);
  if(jid.length == 0){
    res.send("error");
  }
  else{
    if(street.length > 0){
      console.log("here1  " + currentuser );
      db.query('update JOB_SEEKER_PROFILE set Street = \'' + street +  '\' where Js_profileid = ' + currentprof + ';', function (error, results, fields){
        if (error) throw error;
        
      });
    }
    if(city.length > 0){
      db.query('update JOB_SEEKER_PROFILE set City = \'' + city +  '\' where Js_profileid = ' + currentprof + ';', function (error, results, fields){
        if (error) throw error;
        
      });
    }
    if(province.length > 0){
      db.query('update JOB_SEEKER_PROFILE set Province = \'' + province +  '\' where Js_profileid = ' + currentprof + ';', function (error, results, fields){
        if (error) throw error;
        
      });
    }
    if(name.length > 0){
      db.query('update JOB_SEEKER_USER set Name = \'' + name +  '\' where Js_userid = ' + currentuser + ';', function (error, results, fields){
        if (error) throw error;
        
      });
    }
    if(email.length > 0){
      db.query('update JOB_SEEKER_PROFILE set Email = \'' + email +  '\' where Js_profileid = ' + currentprof + ';', function (error, results, fields){
        if (error) throw error;
        
      });
    }
    if(birthday.length > 0){
      db.query('update JOB_SEEKER_USER set Birthday = \'' + birthday +  '\' where Js_userid = ' + currentuser + ';', function (error, results, fields){
        if (error) throw error;
        
      });
    }
    if(sex.length > 0){
      db.query('update JOB_SEEKER_USER set Sex = \'' + sex +  '\' where Js_userid = ' + currentuser + ';', function (error, results, fields){
        if (error) throw error;
        
      });
    }
    res.send("done");
  }


    res.end("yes");
});

app.post('/signup2',function(req,res){ //accept client request
  var name=req.body.name;
  var birthday=req.body.birthday;
  var sex=req.body.sex;
  var email=req.body.email;
  var username=req.body.username;
  var password=req.body.password;
  var street=req.body.street;
  var city=req.body.city;
  var province=req.body.province;
  db.query('insert into USER(Username, Password) values(\'' + username + '\', \'' + password +  '\');', function (error, results, fields){
    if (error) throw error;
    

  });
  db.query('insert into JOB_SEEKER_USER(Name, Birthday, Sex, Username) values(\'' + name + '\', \'' + birthday + '\', \'' +  sex + '\', \'' + username + '\');', function (error, results, fields){
    if (error) throw error;
    

  });

  db.query('INSERT INTO JOB_SEEKER_PROFILE (Email, Street, City, Province, Js_userid) VALUES (\'' + email + '\', \'' + street + '\', \'' + city  + '\', \'' +  province + '\', ' + "(select Js_userid from JOB_SEEKER_USER where Username = \"" + username + "\")" + ');', function (error, results, fields){
    if (error) throw error;
    
  });

   res.send("done");
   res.end("yes");
 });

app.post('/jobseekerdelete',function(req,res){

  db.query('delete from JSPROFILE_APPLIES_FOR_JOB where Js_profileid = ' + currentuser + ';', function (error, results, fields){
    if (error) throw error;
    
  });
  db.query('delete from JOB_SEEKER_USER where Js_userid = ' + currentuser +';', function (error, results, fields){
    if (error) throw error;
    
  });
  db.query('delete from CPROFILE_OFFERS_JOB where C_profileid = ' + currentuser +';', function (error, results, fields){
    if (error) throw error;
    
  });

  db.query('delete from USER where Username = \'' + currentusername +'\';', function (error, results, fields){
    if (error) throw error;
    
  });
    res.send("done");
    res.end("yes");
});

app.post('/jobseekerview',function(req,res){ //accept client request
   db.query('select * from JOB_SEEKER_PROFILE NATURAL JOIN JOB_SEEKER_USER where JS_userid = ' + currentuser + ';', function (error, results, fields){
    if (error) throw error;
    
    
    res.send(results);
    res.end("yes");

  });
 });

app.post('/checkjob',function(req,res){ //accept client request
  var jid=req.body.jid;
  if(jid.length > 0){
   db.query('select Job_id from JOB where Job_id = ' + jid + ';', function (error, results, fields){
    if (error) throw error;
    resq = JSON.stringify(results);
    resq = JSON.parse(resq);
    var i = 0;
    var exist = 0;
    while(i < resq.length){
      if(resq[i].Job_id == jid){
        exist = 1;
        break;
      }
      i++;
    }

    if(exist == 1){
        res.send("done");
    }
    else{
      res.send("error");
    }
    res.end("yes");

  });
	}
	else{
		res.send("error");
		res.end("yes");
	}
 });

app.post('/jobseekerapply',function(req,res){
  var jid = req.body.jid;
  if(jid.length > 0){
	  db.query('INSERT INTO JSPROFILE_APPLIES_FOR_JOB (Job_id, Js_profileid) VALUES ( ' + jid + ', ' + currentprof + ');', function (error, results, fields){
	    if (error) throw error;
	    
	  });
	  res.send("done");
      res.end("yes");
	}
	else{
		res.send("error");
    	res.end("yes");
	}
    
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
