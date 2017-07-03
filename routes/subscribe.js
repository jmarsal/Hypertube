let express = require('express');
let router = express.Router();

let User = require('../models/user.js');


//---->>> POST USER <<<-----
router.post('/', (req, res) => {
  let user = req.body;

  User.create(user, (err, user) => {
    if (err) throw err;
    res.json(user);
  })
});

//---->>> GET USERS <<<-----
router.get('/', (req, res) => {
  User.find((err, users) => {
    if (err) throw err;
    res.json(users);
  })
});

//---->>> DELETE USER <<<-----
app.delete('/:_id', (req, res) => {
  let query = {_id: req.params._id};

  User.remove(query, (err, user) => {
    if (err) throw err;
    res.json(user);
  })
});

//---->>> UPDATE USER <<<-----
app.put('/:_id', (req, res) => {
  let user = req.body;
  let query = req.params._id;

  let update = {
    '$set': {
        login: user.login,
        password: user.password,
        img: user.img,
        firstname: user.firstname,
        lastname: user.lastname
    }
  };

  let options = {new: true};

  User.findOneAndUpdate(query, update, options, (err, user) => {
    if (err) throw err;
    res.json(user);
  });

});


module.exports = router;