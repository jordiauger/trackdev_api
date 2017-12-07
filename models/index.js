/**
 * New node file
 */

module.exports = function (app) {

  var fs = require('fs');
  var path = require('path');
  var Sequelize = require('sequelize');
  var http = require('http')
  var console = require('console');
  var P = app.Promise;

  var db = {};

  console.log("Configuring app for environment: " + app.get('env'));

  if ('development' === app.get('env')) {
    var db_credentials = {
      dbname: "trackdev",
      username: "root",
      password: "",
      host: "127.0.0.1",
      port: 3306
    }
    var force = false;
  } else if ('openshift' === app.get('env')) {
    var db_credentials = {
      dbname: process.env.OPENSHIFT_APP_NAME,
      username: process.env.OPENSHIFT_MYSQL_DB_USERNAME,
      password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
      host: process.env.OPENSHIFT_MYSQL_DB_HOST,
      port: process.env.OPENSHIFT_MYSQL_DB_PORT
    }
    var force = false;
  } else {
    var db_credentials = {
      dbname: "trackdev",
      username: "root",
      password: "",
      host: "127.0.0.1",
      port: 3306
    }
    var force = false;
  }

  console.log("Connecting to " + db_credentials.dbname);

  var sequelize = new Sequelize(
    db_credentials.dbname, db_credentials.username,
    db_credentials.password, {
      host: db_credentials.host,
      dialect: "mysql",
      port: db_credentials.port,
      logging: console.log
    });

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  db.initPromise = sequelize.authenticate()
    .then(function () {
      console.log('Connection has been established successfully.');

      fs.readdirSync(__dirname).filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
      }).forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model;
      });
      Object.keys(db).forEach(function (modelName) {
        if ('associate' in db[modelName]) {
          db[modelName].associate(db);
        }
      });

      return sequelize.sync({force: force});
    })

  return db;
}