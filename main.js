let express = require('express');
let session = require('express-session');
let MongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;
let bcrypt = require('bcrypt');
let bodyParser = require("body-parser");
let http = require('http');
let https = require('https');
let fs = require('fs');
let app = express ();
const multer  = require('multer')
const upload = multer({});

const DOMAINE = "https://localhost"

//Some functions
let Email = require('./ressources/Mail')
let EchapData = require('./ressources/EchapData');
let fct = new EchapData()


// Template & session
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret : "SECRET PHRASE HERE",
    resave : false,
    saveUninitialized : true,
    cookie : {
        path: '/',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 , //One year for cookies life
        secure: true
    }
}));

//routes
MongoClient.connect('mongodb://localhost:27017/',  {useUnifiedTopology: true},(err, db) => {

    app.get('/', (req,res) => {
        dbo = db.db("sinfStudents");
        dbo.collection('users').find({activated : true}).sort({fullname : 1}).limit(16).toArray((err, doc) => {
            if (err) throw err;
            doc = (req.session.fullname === undefined) ? fct.arrEchap(doc,req) : doc;
            res.render('index', {fullname: req.session.fullname, students:doc, cookie: req.session.showCookieAlert});
        });
    });

    app.get('/loginSignup', (req,res) => {
        if(req.session.fullname !== undefined){res.redirect('/')}
        else{res.render('loginSignup', { cookie: req.session.showCookieAlert});}
    });

    app.post('/login', (req,res) => {
        if(req.session.fullname !== undefined){res.redirect('/')}
        else{
            dbo = db.db("sinfStudents");
            dbo.collection('users').findOne({email : req.body.email}, (err, doc) => {
                if(err) throw err;
                if(doc === null) res.render('loginSignup', {err : "Username or password is incorrect", cookie: req.session.showCookieAlert} );
                else if(!doc.activated) res.render('loginSignup', {err : "You need to confirm your email address to activate your account", cookie: req.session.showCookieAlert} );
                else{
                    bcrypt.compare(req.body.password, doc.password, (err, check) => { // lib https://www.npmjs.com/package/bcrypt
                        if(check){
                            req.session.id = doc._id;
                            req.session.email = doc.email;
                            req.session.fullname = doc.fullname;

                            res.redirect('/');
                        }else{
                            res.render('loginSignup', {err : "Username or password is incorrect", cookie: req.session.showCookieAlert} );
                        };
                    });
                };
            });
        }
    });

    app.post('/singup', (req, res) => {
        if(req.body.email !== undefined){req.body.email = req.body.email.toLowerCase();}
        if(req.session.fullname !== undefined){res.redirect('/')}
        if(req.body.password.length < 8 || req.body.password.length > 32) {res.render('loginSignup', {sigUpErr : "Your password must contain 8 to 32 characters.", cookie: req.session.showCookieAlert} )}
        if(req.body.email.split("@")[0] !== req.body.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(' ', ".")) {res.render('loginSignup', {sigUpErr : "Please enter your full name.", cookie: req.session.showCookieAlert} )}
        else if(req.body.name.length > 100) {res.render('loginSignup', {sigUpErr : "Your name must contain a maximum of 100 characters.", cookie: req.session.showCookieAlert} )}
        else if(req.body.email.length > 100) {res.render('loginSignup', {sigUpErr : "Your email must contain a maximum of 100 characters.", cookie: req.session.showCookieAlert} )}
        else if(req.body.email.split("@")[1] !=="student.uclouvain.be"){res.render('loginSignup', {sigUpErr : "You need to use a \"@student.uclouvain.be\" email address", cookie: req.session.showCookieAlert} )}
        else{
            dbo = db.db("sinfStudents");
            dbo.collection('users').findOne({email: req.body.email}, (err, doc) => {
                if (err) throw err;
                if(doc !== null){
                    if (doc.email === req.body.email){res.render('loginSignup', {sigUpErr : "Email already used.", cookie: req.session.showCookieAlert})}
                }else{
                    bcrypt.genSalt(7,(err, salt) => { // lib https://www.npmjs.com/package/bcrypt
                        bcrypt.hash(req.body.password, salt, (err, hash) => {
                            bcrypt.genSalt(5,(err, saltT) => { //create a key for account confirmation
                                bcrypt.hash("AGAVr=xas6pDG9X6" + (Math.floor(Math.random() * 100000000000)).toString(), saltT, (err, keyConf) => {

                                    let enter = {
                                        "activated" : false,
                                        "profilePicture" : "/img/defaultProfile.jpg",
                                        "key":keyConf,
                                        "password" : hash,
                                        "email" : req.body.email,
                                        "fullname" : req.body.name,
                                        "toDisplay" : {
                                            "profile" : false,
                                            "description": true,
                                            "profilePicture": true,
                                            "studyYear": true,
                                            "option": true,
                                            "topSkills": true,
                                            "otherSkills": true,
                                            "links": true
                                        }
                                    };


                                    dbo.collection('users').insertOne(enter, (err, data) => {
                                        let conf = new Email()
                                        conf.setEmail(
                                            req.body.email,
                                            'Confirm your account on the computer sciences students website.',
                                            DOMAINE + '/confirmAccount?key=' + keyConf + '&user=' + req.body.email.split("@")[0]
                                        )
                                        conf.sendEmail()

                                        res.render('loginSignup', {validEnter:"An email has been sent to confirm your account.", cookie: req.session.showCookieAlert});
                                    });
                                });
                            });
                        });
                    });
                };
            });
        };
    });

    app.get('/err404', (req,res) => {
        res.render('err404', {fullname: req.session.fullname, cookie: req.session.showCookieAlert});
    });

    app.get('/persoPage', (req,res) => {
        if(req.query.user === undefined){res.redirect('/err404')}
        else{
            dbo = db.db("sinfStudents");
            dbo.collection('users').findOne({_id: new ObjectID(req.query.user),activated : true},(err, doc) => {
                if (err) throw err;
                if(doc === null){res.redirect('/err404')}
                else{
                    doc = (req.session.fullname === undefined) ? fct.jsonEchap(doc,req) : doc;
                    if(doc === null){
                        res.redirect('/err404')
                    }else{
                        res.render('persoPage', {fullname: req.session.fullname, student:doc, cookie: req.session.showCookieAlert});
                    }
                }
            });
        }
    });

    app.get('/editPersoPage', (req,res) => {
        if(req.session.fullname === undefined){res.redirect('/loginSignup')}
        else{
            dbo = db.db("sinfStudents");
            dbo.collection('users').findOne({fullname:req.session.fullname},(err, student) => {
                dbo.collection('presets').find().sort({name:1}).toArray((err, data) => {
                    res.render('editPersoPage', {fullname: req.session.fullname, data:data, student: student, cookie: req.session.showCookieAlert});
                })
            })
        }
    });

    app.post('/editPersoPage',upload.single('profilePicture'), (req,res) => {
        if(req.session.fullname === undefined){res.redirect('/loginSignup')}
        else{

            dbo = db.db("sinfStudents");
            dbo.collection('users').findOne({fullname:req.session.fullname},(err, student) => {
                dbo.collection('presets').find().sort({name:1}).toArray((err, data) => {
                    let toUpdate = fct.formEchap(req, student, data)

                    dbo.collection("users").updateOne({_id:student._id}, {$set:toUpdate}, (err, data) => {
                        if (err) throw err;
                        res.redirect('/persoPage?user=' + student._id)
                    });
                })
            })
        }
    });

    app.get('/confirmAccount', (req,res) => {
        if(req.query.user === undefined || req.query.key === undefined){res.redirect('/')}
        else{
            dbo = db.db("sinfStudents");
            dbo.collection('users').findOne({email : req.query.user + "@student.uclouvain.be"}, (err, doc) => {
                if (err) throw err;
                if(doc === null || doc.activated){res.redirect('/')}
                else if(doc.key === req.query.key){

                    dbo.collection("users").updateOne({_id:doc._id}, { $set:{activated:true}}, (err, data) => {
                        if (err) throw err;
                        res.redirect('/loginSignup');
                    });
                }else{
                    res.redirect('/err404');
                }
            });
        }
    });

    app.post('/sendMailForgotPasswrd', (req,res) => {
        if(req.body.email !== undefined){req.body.email = req.body.email.toLowerCase();}
        dbo = db.db("sinfStudents");
        dbo.collection('users').findOne({email : req.body.email}, (err, doc) => {
            if (err) throw err;
            let timeLastChange;
            try{
                timeLastChange = doc.changePsswrd["timeLastChange"]
            }catch (e) {
                timeLastChange = undefined
            }
            if (doc === null){
                res.status(200).send('NO_MATCH')
            }else if (!doc.activated){
                res.status(200).send('NOT_ACTIVATED')
            }
            else if (timeLastChange !== undefined && (parseInt(doc.changePsswrd["timeLastChange"]) + 300000) >  Date.now()){
                res.status(200).send('MIN_FIVE_MIN')
            }else {
                let textKey = "!Z$P@Rv3b#8=nd3#" + (Math.floor(Math.random() * 100000000000)).toString()
                bcrypt.genSalt(5,(err, saltT) => { //create a key for password
                    bcrypt.hash(textKey, saltT, (err, keyConf) => {

                        let toUpdate = {
                            changePsswrd : {
                                passKey:keyConf,
                                timeLastChange : Date.now()
                            }
                        }

                        dbo.collection("users").updateOne({_id:doc._id}, {$set:toUpdate}, (err, data) => {
                            if (err) throw err;

                            //send Email
                            let conf = new Email()
                            conf.setEmail(
                                req.body.email,
                                'Forgot password on the computer sciences students website.',
                                DOMAINE + '/newPassword?key=' + keyConf + '&user=' + req.body.email.split("@")[0] // TO CHANGE
                            )
                            conf.sendEmail()

                            res.status(200).send('OK')
                        });
                    })
                })
            }
        })
    });

    app.get('/newPassword', (req,res) => {
        if(req.query.user === undefined || req.query.key === undefined){res.redirect('/')}
        else{
            req.session.key = req.query.key
            req.session.user = req.query.user
            res.render("newPassword", {cookie: req.session.showCookieAlert})
        }
    });

    app.post('/newPassword', (req,res) => {
        let user = req.session.user
        let key  = req.session.key

        delete req.session.user
        delete req.session.key

        if(user === undefined ||key === undefined || req.body.password === undefined || req.body.confirmPassword === undefined){res.redirect('/')}
        else if(req.body.password !==  req.body.confirmPassword){res.render("newPassword", {cookie: req.session.showCookieAlert})}
        else{
            dbo = db.db("sinfStudents");
            dbo.collection('users').findOne({email : user + "@student.uclouvain.be"}, (err, doc) => {
                if (err) throw err;
                if(doc !== null && doc.changePsswrd["passKey"] === key){
                    bcrypt.genSalt(7,(err, salt) => { // lib https://www.npmjs.com/package/bcrypt
                        bcrypt.hash(req.body.password, salt, (err, hash) => {
                            dbo.collection("users").updateOne({_id:doc._id}, {$set:{password : hash, "changePsswrd.passKey" : -1}}, (err, data) => {
                                if (err) throw err;
                                res.redirect('/loginSignup');
                            })
                        })
                    })
                }else{
                    res.redirect('/err404');
                }
            });
        }
    });

    app.post('/search', (req, res) => {
        dbo = db.db("sinfStudents");
        dbo.collection('users').find({activated : true, $or: [
                {fullname: {$regex: req.body.word, $options: "i"}},
                {"topSkills.1.name" : {$regex: req.body.word, $options: "$i"}},
                {"topSkills.2.name" : {$regex: req.body.word, $options: "$i"}},
                {"topSkills.3.name" : {$regex: req.body.word, $options: "$i"}},
                {otherSkills:{$regex: req.body.word, $options: "$i"}},
                {studyYear: {$regex: req.body.word, $options: "$i"}},
                {option: {$regex: req.body.word, $options: "$i"}},
                {"links.facebook.username" : {$regex: req.body.word, $options: "$i"}},
                {"links.discord.data" : {$regex: req.body.word, $options: "$i"}},
                {"links.github.username" : {$regex: req.body.word, $options: "$i"}},
                {"links.mail.data" : {$regex: req.body.word, $options: "$i"}},
                {"links.linkedin.username" : {$regex: req.body.word, $options: "$i"}},
                {"links.wirenotes.username" : {$regex: req.body.word, $options: "$i"}},
                {"links.bitbucket.username" : {$regex: req.body.word, $options: "$i"}},
            ]})
            .sort({
                fullname: 1,
                studyYear: 1,
                option: 1,
                otherSkills: 1,
                "topSkills.1.name":1,
                "topSkills.2.name":1,
                "topSkills.3.name":1,
                "links.facebook.username" :1,
                "links.discord.data" : 1,
                "links.github.username" : 1,
                "links.mail.data" : 1,
                "links.linkedin.username" : 1,
                "links.wirenotes.username" : 1,
                "links.bitbucket.username" :1
            })
            .skip(16 * parseInt(req.body.nbProfiles)).limit(16)
            .toArray((err, doc) => {

            if (err) throw err;
            doc = (req.session.fullname === undefined) ? fct.arrEchap(doc,req) : doc;
            if(doc.length === 0){res.status(200).send('EMPTY');}
            else {res.render('templateProfile' , {students : doc});}
        });

    });

    app.post('/ajaxCookieAlert', (req, res) => {
        if(req.body.showCookieAlert === "false"){
            req.session.showCookieAlert = req.body.showCookieAlert;
            res.status(200).send('Alert will not appear again.');

        }else res.status(400).send('ERROR_SET_showCookieAlert_FALSE');
    });

    app.get('/disconnection', (req, res) => {
        delete req.session.fullname;
        delete req.session.email;
        delete req.session.id;
        res.redirect('/');
    });

    app.use(express.static('static/assets'));

    //default case -> 404 not found
    app.get('*', (req, res) => {
        res.redirect('/err404');
    });
}); //

https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: "axmPBp^jE4r5HB-mjy6uR4E@jFp7qXLLDe+rv&#6G8!K2aV-!nQNV9@2fqHw_Xw2yuWyHdAkksyymLmVC6?V3d_7d-@NtEj5gza!3h4P=KaD5k-!+mf=b4dCbjFSRKuJjC4$xY2SBVgMSutz=eLcsrLNV9!eYzj=_?dA@!NBQCR6c&9MJB^@_rPCF9PPZjsdRTb2xMMjQG=$XD+aN4_n^se?WBdhkJkYu@C*$wZ^phaTs+V!DQMdRpVPtdG=-ucB"
}, app).listen(443);
//SSL key : axmPBp^jE4r5HB-mjy6uR4E@jFp7qXLLDe+rv&#6G8!K2aV-!nQNV9@2fqHw_Xw2yuWyHdAkksyymLmVC6?V3d_7d-@NtEj5gza!3h4P=KaD5k-!+mf=b4dCbjFSRKuJjC4$xY2SBVgMSutz=eLcsrLNV9!eYzj=_?dA@!NBQCR6c&9MJB^@_rPCF9PPZjsdRTb2xMMjQG=$XD+aN4_n^se?WBdhkJkYu@C*$wZ^phaTs+V!DQMdRpVPtdG=-ucB


// Redirect from http port 80 to https
http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);
