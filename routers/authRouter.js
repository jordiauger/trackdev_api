module.exports = function(app) {

  var express = require('express')
  var jwt = require('express-jwt')({secret: app.secret})
  var Users = rootRequire('controllers/c_user')(app)

  var util = rootRequire('util')

  var mailing = rootRequire('controllers/c_mail')(app);

  var router = express.Router();

  router.use(jwt);

  /**
   * User
   */
  router.get('/api/users/:id',Users.getById);
  router.post('/api/users/:id',Users.update);
  /**
   * Mailing
   */
  router.post('/api/mail/sendM',mailing.sendM);



  return router
};