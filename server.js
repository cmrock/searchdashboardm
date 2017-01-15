var express	=	require('express');
var session	=	require('express-session');
var bodyParser  = 	require('body-parser');
var app	= express();
var mongoose = require('mongoose');
var http = require('http').Server(app);
var LocalStrategy   = require('passport-local').Strategy;
app.use(bodyParser.urlencoded({ extended: false }));
var router = express.Router();
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/",router);
app.use(express.static('views'));
app.set('view engine', 'ejs');
var path = __dirname + '/views/';
var crypto = require('crypto');
mongoose.connect('mongodb://localhost:27017/searchdb');
var usersinfo,categoryinfo;
var sess;
//var db = mongoose.connection;
var Schema = mongoose.Schema;
    var usersSchema = new Schema({
        Name: {type: String},
        Dob: {type: String},
        Email: {type: String},
        Password: {type: String},
        Organization: {type: String},
        Created: {type: String}
    });
users = mongoose.model('users', usersSchema);

var categorySchema = new Schema({
    Name: {type: String},
    Description: {type: String},
    Website: {type: String}
});
category = mongoose.model('category', categorySchema);
var contactSchema = new Schema({
    Name: {type: String},
    Email: {type: String},
    Message: {type: String}
});
contact = mongoose.model('contact', contactSchema);
// make this available to our users in our Node applications
module.exports = usersinfo;
module.exports = categoryinfo;


// call admin login
app.post('/adminlogin', function (req, res) {

    var hashnew = crypto.createHash('md5').update(req.body.pass).digest("hex");
    users.find({ Email: req.body.email, Password :  hashnew}, function (err, docs) {
        console.log(docs.length);
        if (docs.length == 0){
            return res.send("Please enter correct credentials.");
        }else{
            sess = req.session;
            sess.email = req.body.email;
            return res.send("done");
        }
    });

});

// call login
app.post('/login', function (req, res) {
    var hashnew = crypto.createHash('md5').update(req.body.pass).digest("hex");
    users.find({ Email: req.body.email, Password :  hashnew}, function (err, docs) {
        console.log(docs.length);
        if (docs.length == 0){
            return res.send("Please enter correct credentials.");
        }else{
            sess = req.session;
            sess.email = req.body.email;
            return res.send("done");
        }
    });
});

// call forgot password
app.post('/fpassword', function (req, res) {

    connection.query("select * from users where email = '" + req.body.email + "'", function (err, rows) {
        numRows = rows.length;
        if (err)
            return done(err);
        if (numRows == 0) {
            res.end('email does not exist');
        }
        else {
            res.end('done');
        }
    });
});

// call add  category
app.post('/addCategory', function (req, res) {
    var categoryinfo = new category ({
        Name:  req.body.categoryname,
        Description:  req.body.description,
        Website: req.body.website,
    });
    categoryinfo.save(function(err, thor) {
        if (err){
            return res.send("error");
        }else{
            console.log('record added');
            return res.send("done");
        }
    });
});

// call remove  category
app.post('/removeCategory', function (req, res) {
    category.remove({_id : req.body.categoryid}, function(err) {
        if (!err) {
            res.send("done");
        }
        else {
            res.send("error");
        }
    });
});

// call search result method
app.post('/searchResult', function (req, res) {
            category.find({'Description' : new RegExp(req.body.keyword, 'i')}, function (err, docs1) {
                if (err) {
                    throw err;
                }
                else {
                    res.type('text/plain');
                    res.json(docs1);
                }
            });
});

// call signup info method
app.post('/signup', function (req, res) {
        var created = new Date();
       var hash = crypto.createHash('md5').update(req.body.pass).digest("hex");
        var signupsave = new users ({
            Name:  req.body.name,
            Dob:  req.body.dob,
            Email: req.body.email,
            Password: hash,
            Organization: req.body.org,
            Created: created,
        });
    users.find({ Email: req.body.email }, function (err, docs) {
        console.log(docs.length);
        if (docs.length == 0){
            signupsave.save(function(err, thor) {
                if (err){
                    return res.send("error");
                }else{
                    console.log('record added');
                    return res.send("success");
                }
            });
        }else{
            return res.send("exits");
        }
    });

});

// call edit info method
app.post('/editinfo', function (req, res) {
    sess = req.session;
    if (sess.email) {
    users.update({ Name: req.body.name,Dob: req.body.dob,Organization: req.body.org}, function (err, docs) {
        console.log(docs);
        res.end('success');
    });
    }
});

// call contact us method
app.post('/contacts', function (req, res) {
    var contactinfo = new contact ({
        Name:  req.body.name,
        Email:  req.body.email,
        Message: req.body.message,
    });
    contactinfo.save(function(err, thor) {
        if (err){
            return res.send("error");
        }else{
            console.log('record added');
            return res.send("success");
        }
    });
});

// call remove user method
app.post('/removeuser', function (req, res) {
    users.remove({_id : req.body.id}, function(err) {
        if (!err) {
            res.send("success");
        }
        else {
            res.send("error");
        }
    });
});

// call change Password method
app.post('/changePassword', function (req, res) {
    sess = req.session;
    if (sess.email) {
        var hashnew = crypto.createHash('md5').update(req.body.password).digest("hex");
        users.update({ Password: hashnew}, function (err, docs) {
            console.log(docs);
            res.type('text/plain');
            res.json(docs);
        });
    }
});

// Loing page
app.get('/login', function (req, res) {
    sess = req.session;
    if (sess.email) {
        res.redirect('/dashboard');
    }
    else {
        res.render('login');
    }
});

// Register page
app.get('/register', function (req, res) {
    sess = req.session;
    if (sess.email) {
        res.redirect('/dashboard');
    }
    else {
        res.render('register', {title: "Register"});
    }
});
// Forgot password page
app.get('/forgot_password', function (req, res) {
    sess = req.session;
    if (sess.email) {
        res.redirect('/dashboard');
    }
    else {
        res.render('forgot_password', {title: "forgot password"});
    }
});

// Forgot contact page
app.get('/contact', function (req, res) {
    sess = req.session;
    if (sess.email) {
        res.redirect('/dashboard');
    }
    else {
        res.render('contact', {title: "Contact"});
    }
});
app.get('/logout', function (req, res) {

    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });

});

// Forgot about us page
app.get('/aboutus', function (req, res) {
    sess = req.session;
    if (sess.email) {
        res.redirect('/dashboard');
    }
    else {
        res.render('aboutus', {title: "homepage"});
    }
});

// Forgot Home page page
app.get('/',function(req,res){
    sess=req.session;
    if(sess.email)
    {
        res.redirect('/register');
    }
    else{
        res.render('index');
    }
});

//  Dashboard page
app.get('/dashboard', function (req, res) {
    sess = req.session;
    if (sess.email) {
        users.find({ Email: sess.email}, function (err, docs) {
            category.find(function (err, docs1) {
            console.log(docs);
            res.render('dashboard', {
                session: req.session,
                usersinfo: docs,
                categorylist: docs1,
            });
    });
        });
    }
    else {
        res.redirect('/');
    }

});

//  admin page
app.get('/admin', function (req, res) {
    sess = req.session;
    if (sess.email) {
        res.render('admin-dashboard');
    }
    else {
        res.render('admin');
    }
});

//  admin dashboard page
app.get('/admin-dashboard', function (req, res) {
    sess = req.session;
    if (sess.email) {
        users.find({ Email: sess.email}, function (err, docs) {
            category.find(function (err, docs1) {
            console.log(docs);
            res.render('admin-dashboard', {
                usersinfo: docs,
                category:docs1
            });
        });
        });
    }
    else {
        res.redirect('/admin');
    }
});

//  profile page
app.get('/profile', function (req, res) {
    sess = req.session;
    if (sess.email) {
        users.find({ Email: sess.email}, function (err, docs) {
                console.log(docs);
                res.render('profile', {
                    usersinfo: docs
                });
            });
    }
    else {
        res.redirect('/login');
    }
});

//  admin page
app.get('/editprofile', function (req, res) {
    sess = req.session;
    if (sess.email) {
        users.find({ Email: sess.email}, function (err, docs) {
            console.log(docs);
            res.render('editprofile', {
                usersinfo: docs
            });
        });
    }
    else {
        res.redirect('/login');
    }


});

//  User list page
app.get('/UserList', function (req, res) {
    sess = req.session;
    if (sess.email) {
        users.find(function (err, docs) {
            users.find({ Email: sess.email}, function (err, docs1) {
                console.log(docs);
                res.render('UserList', {
                    userlist: docs,
                    usersinfo: docs1,
                });
            });
        });
    }
    else {
        res.redirect('/login');
    }
});

//  customer query page
app.get('/Customer_Query', function (req, res) {
    sess = req.session;
    if (sess.email) {
        contact.find( function (err, docs) {
            users.find({ Email: sess.email},function (err, docs1) {
                console.log(docs);
                res.render('Customer_Query', {
                    querylist: docs,
                    usersinfo: docs1,
                });
            });
        });
    }
    else {
        res.redirect('/login');
    }
});

//  change password page
app.get('/ChangePassword', function (req, res) {
    sess = req.session;
    if (sess.email) {
        users.find({ Email: sess.email}, function (err, docs) {
            console.log(docs);
            res.render('ChangePassword', {
                usersinfo: docs
            });
        });
    }
    else {
        res.redirect('/login');
    }


});
var port = process.env.PORT || 1337;
http.listen(port);

