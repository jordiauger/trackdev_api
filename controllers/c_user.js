/**
 * New node file
 */


/*
 * GET users listing.
 */

module.exports = function (app) {

  var db = app.db;
  var secret = app.secret;
  var P = app.Promise;

  var util = require('../util');
  var dao = require('../dao')(app);
  var bcrypt = require('bcrypt-nodejs');
  var jwt = require('jsonwebtoken');

  return {
      login: function (req, res) {
          util.checkParams(req.body, ['email', 'password']);
          dao.User.checkPassword(req.body.email, req.body.password)
              .then(function (user) {
                  var token = jwt.sign({email: user.email}, secret);
                  util.jsonResponse(res, {jwt: token, email: user.email, id: user.id});
              })
              .catch(util.resendError.bind(util, res))
              .done();
      },

      getById: function (req, res) {
          util.checkParams(req.params, ['id']);
          dao.User.getById(req.params.id)
              .then(function (user) {
                  util.jsonResponse(res, {username: user.username, email:user.email, name: user.name, gender: user.gender, birth: user.birth});
              })
              .catch(util.resendError.bind(util, res))
              .done();

      },

      getUserByRegisterCode: function(req,res){
          util.checkParams(req.params, ['registration_code']);
          dao.User.getUserByRegisterCode(req.params.registration_code)
              .then(function (user) {
                  util.jsonResponse(res, {user: user});
              })
              .catch(util.resendError.bind(util, res))
              .done();
      },

      update: function(req,res){
          util.checkParams(req.body, ['user']);
          if (req.body.user.old_password){
              dao.User.checkPassword(req.body.user.email, req.body.old_password)
                  .then(function (user) {
                      user.password = bcrypt.hashSync(req.body.user.password);
                      dao.User.update(req.body.user)
                          .then(function (user) {
                              util.jsonResponse(res, user);
                          })
                          .catch(util.resendError.bind(util, res))
                  })
                  .catch(util.resendError.bind(util, res))
                  .done();
          }else{
              dao.User.update(req.body.user)
                  .then(function (user) {
                      util.jsonResponse(res, user);
                  })
                  .catch(util.resendError.bind(util, res))
                  .done();
          }
      },

      create: function (req, res) {
          util.checkParams(req.body, ['email', 'username', 'password']);

          var attribs = {
              username: req.body.username,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password)
          };

          db.sequelize.transaction(function (t) {
              return P.all([
                  dao.User.getByEmail(req.body.email, t),
                  dao.User.getByUsername(req.body.username, t)
              ])
                  .spread(function (s1, s2) {
                      if (!s1 && !s2) {
                          return dao.User.create(attribs, t);
                      } else if (s1) {
                          util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, "Already exist a User with email = " + req.body.email);
                      } else {
                          util.throwError(400, util.Error.ERR_ENTITY_EXISTS, "Already exist a User with username = " + req.body.username);
                      }
                  })
          }).then(util.jsonResponse.bind(util, res))
              .catch(util.resendError.bind(util, res))
              .done();
      },

      /**
       * Encara que acabi fent un update, aquesta es una via per fer un update sense passar per el authRouter, necesari per quan
       * el usuari encara no ha sigut donat d'alta, es a dir, primer moment en que entra a l'aplicacio des de el correu
       */
      createFromRegister: function(req, res){
          util.checkParams(req.body, ['user']);
          util.checkParams(req.body.user,['password','name','id']);
          var userToUpdate = req.body.user;
          userToUpdate.password = bcrypt.hashSync(userToUpdate.password);
          userToUpdate.registration_code = null;
          dao.User.createFromRegister(userToUpdate)
              .then(function (user) {
                  util.jsonResponse(res, user);
              })
              .catch(util.resendError.bind(util, res))
              .done();
      },

      getAllUsers: function(req, res){
          console.log(bcrypt.hashSync("123456"));
          dao.User.getAllUsers()
              .then(function (users) {
                  util.jsonResponse(res, users);
              })
              .catch(util.resendError.bind(util, res))
              .done();

      }

    /**
    fblogin: function(req,res){
        util.checkParams(req.body, ['name','email', 'username', 'password']);
        var attribs = {
          username: req.body.username,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password)
        };
        dao.User.getByUsername(req.body.username)
            .then(function(user) {
                if (user) {
                    var token = jwt.sign({username: user.username}, secret);
                    util.jsonResponse(res, {jwt: token, username: user.username,id:user.id});
                } else {
                    throw new Error("User not found");
                }
            })
            .catch(function() {
                return db.sequelize.transaction(function (t) {
                    return P.all([
                        dao.User.getByEmail(req.body.email, t),
                        dao.User.getByUsername(req.body.username, t)
                    ])
                        .spread(function (s1, s2) {
                            if (!s1 && !s2) {
                                return dao.User.create(attribs, t);
                            } else if (s1) {
                                util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, "Already exist a User with email = " + req.body.email);
                            } else {
                                util.throwError(400, util.Error.ERR_ENTITY_EXISTS, "Already exist a User with username = " + req.body.username);
                            }
                        })
                }).then(function (user) {
                        var token = jwt.sign({username: user.username}, secret);
                        util.jsonResponse(res, {jwt: token, username: user.username,id:user.id});
                    })
                    .catch(util.resendError.bind(util, res))
                    .done()
            })
            .done();
    },**/
    /**
    getByUsername: function (req, res) {
       util.checkParams(req.params, ['username']);
        dao.User.getByUsername(req.params.username)
            .then(function (user) {
              var token = jwt.sign({username: user.username}, secret);
              util.jsonResponse(res, {username: user.username, email:user.email, name: user.name, gender: user.gender, birth: user.birth});
            })
            .catch(util.resendError.bind(util, res))
            .done();

    },



    updatepassword:function (req,res){
            //util.checkParams(req.body, ['email', 'name','gender','birth']);

        dao.User.checkPassword(req.body.email, req.body.old_p)
            .then(function (user) {
                dao.User.update({email: req.body.email, password: bcrypt.hashSync(req.body.new_p)})
                    .then(function (user) {
                        var token = jwt.sign({email: user.email}, secret);
                        util.jsonResponse(res, {
                            email: user.email,
                            name: user.name,
                            gender: user.gender,
                            birth: user.birth
                        });
                    })
                    .catch(util.resendError.bind(util, res))
                    .done();
            })
            .catch(util.resendError.bind(util, res))
            .done();

    },**/








  }
};
