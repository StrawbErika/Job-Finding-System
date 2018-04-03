const db = require('../db/db');
var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {

		res.render('home');
});

router.get('/adminloginpage', function(req, res, next) {
							//v data passed to template -> template is the ejs file
		res.render('adminloginpage'); //make this ejs file an html with these data and send as response
});

router.get('/adminwelcome', function(req, res, next) {

		res.render('home_administrator');
});

router.get('/adminreportgenerator', function(req, res, next) {

		res.render('adminreportGenerator');
});

router.get('/companyloginpage', function(req, res, next) {
							//v data passed to template -> template is the ejs file
		res.render('companyloginpage'); //make this ejs file an html with these data and send as response
});

router.get('/companywelcome', function(req, res, next) {
		res.render('home_company');
});

router.get('/companywelcomenotapproved', function(req, res, next) {

		res.render('home_company_notapproved');
});

router.get('/companyreportgenerator', function(req, res, next) {

		res.render('companyreportGenerator');
});

router.get('/companyviewjobseekerprofile', function(req, res, next) {

		res.render('companyviewjobseekerprofile');
});

router.get('/companysignup', function(req, res, next) {
		res.render('signup');
});

router.get('/companies', function(req, res, next) {
		res.render('companies'); //, {type : user.type}
});

router.get('/jobseekerloginpage', function(req, res, next) {
							//v data passed to template -> template is the ejs file
		res.render('jobseekerloginpage'); //make this ejs file an html with these data and send as response
});

router.get('/jobseekerwelcome', function(req, res, next) {

		res.render('home_jobseeker');
});


router.get('/jobseekersignup', function(req, res, next) {

		res.render('jssignup');
});

router.get('/jobs', function(req, res, next) {
    //var user = req.session.user;
		res.render('jobs'); //, {type : user.type}
});







module.exports = router;
