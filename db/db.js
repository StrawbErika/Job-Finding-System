var mysql = require('mysql') ;


//function login(username, password){
	module.exports = mysql.createConnection({
	    host: 'localhost',
	    user: 'root',
	    password: '123',
	    database: 'transport'
	});
//}

function getuser() {
   	 var x = document.getElementById("frm1");
   	 var data = '';
      	 data +=x.elements[0].value;
      	 return data;		
}

function getpass() {
   	 var y = document.getElementById("frm1");
   	 var data = '';
      	 data +=y.elements[1].value;
      	 return data;		
}

function login(){ //redirect to lohinpage
   window.location.replace("http://localhost:3000/loginpage");
}
