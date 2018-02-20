module.exports = function (app) {
  var express = require('express')
  var Users = rootRequire('controllers/c_user')(app)

  var router = express.Router()

// User login
  router.post('/api/users/login', Users.login);
// User login and registration via Facebook
  router.get('/api/users/register/:registration_code', Users.getUserByRegisterCode);
// User registration
  router.post('/api/users', Users.createFromRegister);

  router.get('/api/users',Users.getAllUsers);

  return router;
}