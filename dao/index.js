/**
 * New node file
 */

module.exports = function (app) {
  var dao = {};

  dao.User = require('./d_user')(app, dao);

  return dao;
}