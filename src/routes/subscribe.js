let express = require('express');
let router = express.Router();

let User = require('../../models/user.js');

//---->>> POST USER <<<-----
router.post('/', (req, res) => {
  let user = req.body;

  User.create(user, (err, users) => {
    if (err) throw err;
    res.json(users);
  })
});

//---->>> GET USERS <<<-----
router.get('/', (req, res) => {
  User.find((err, users) => {
    if (err) throw err;
    res.json(users);
  })
});

module.exports = router;