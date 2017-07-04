let express = require('express');
let router = express.Router();
let crypto = require('crypto');

let User = require('../models/user.js');
let Check = require('../models/check.js');


//---->>> POST USER <<<-----
router.post('/', (req, res) => {

  Check.subscribeInputs(req)
    .then((response) => {

      if (response.status === "success") {
        let user = req.body;
        user.password = crypto.createHash('sha512').update(user.password).digest('hex');

        User.create(user, (err, user) => {
          if (err) throw err;
          res.json({status: "success", content: user});
        })
      } else {
        res.json({status: "error", content: response.data})
      }
      
    })
    .catch((err) => {
      console.error(err);
    });
  
});

//---->>> GET USERS <<<-----
router.get('/', (req, res) => {
  User.find((err, users) => {
    if (err) throw err;
    res.json(users);
  })
});

//---->>> DELETE USER <<<-----
router.delete('/:_id', (req, res) => {
  let query = {_id: req.params._id};

  User.remove(query, (err, user) => {
    if (err) throw err;
    res.json(user);
  })
});

//---->>> UPDATE USER <<<-----
router.put('/:_id', (req, res) => {
  let user = req.body;
  user[0].password = crypto.createHash('sha512').update(user[0].password).digest('hex');
  let query = {};
  query._id = req.params._id;

  let update = {
    '$set': {
        login: user.login,
        password: user.password,
        email: user.email,
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