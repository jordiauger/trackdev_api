/**
 * New node file
 */


module.exports = function (app) {
    var db = app.db;
    var User = {};

    var util = require('../util');
    var bcrypt = require('bcrypt-nodejs');

    User.checkPassword = function (email, password, t) {
    return User.getByEmail(email, t)
      .then(function (user) {
        if (user) {
            if (user.active == 1){
              if (bcrypt.compareSync(password, user.password)) {
                return user;
              } else {
                util.throwError(400, util.Error.ERR_AUTHENTICATION, "Invalid password");
              }
            }else{
                util.throwError(400, util.Error.ERR_AUTHENTICATION, "This user is not active, please contact admins");
            }
        } else {
          util.throwError(400, util.Error.ERR_ENTITY_NOT_FOUND, "There is no User with email: " + email);
        }
      });
    };

    User.getByUsername = function (username, t) {
    return db.User.find(util.addTrans(t, {where: {username: username}}));
    };

    User.getByEmail = function (email, t) {
    return db.User.find(util.addTrans(t, {where: {email: email}}));
    };

    User.getUserByRegisterCode = function (registration_code, t) {
        return db.User.find(util.addTrans(t, {where: {registration_code: registration_code}}));
    };

    User.create = function (user_data, t) {
        return db.User.create(user_data, util.addTrans(t, {}));
    };

    User.update = function (user_data,t){
    return db.User.find(util.addTrans(t, {where: {id: user_data.id}}))
        .then(function (user){
           return user.update(user_data,t);
        });
    };


    User.createFromRegister = function (user_data,t){
        return db.User.find(util.addTrans(t, {where: {id: user_data.id}}))
            .then(function (user){
                if (user.registration_code != null && user.password == null) {
                    return user.update(user_data, t);
                }else{
                    util.throwError(400, util.Error.ERR_AUTHENTICATION, "This user can't perform a register");
                }
            });
    };

    User.getAllUsers = function(t){


        return db.User.findAll(util.addTrans(t,{}));
    };


  return User;
}