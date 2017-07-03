const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// APIs

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hypertube');

let db = mongoose.connection;
db.on('error', console.error.bind(console, '# MongoDB - connection error: '));

//---->>> SET UP SESSIONS <<<-----
app.use(session({
    secret: 'ferEFdf_dsvVaas',
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 2},
    store: new MongoStore({mongooseConnection: db, ttl: 2 * 24 * 60 * 60})
    //ttl: 2 days * 24 hours * 60 minutes * 60 seconds
}));

// SAVE TO SESSION
app.post('/session', (req, res) => {
  let session = req.body;
  req.session.session = session;
  req.session.save((err) => {
    if (err) throw err;
    res.json(req.session.session);
  })
});

// END APIs

app.listen(3001, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('API Server is listening in http://localhost:3001');
});
