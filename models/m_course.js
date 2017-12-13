/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {

    var Course = sequelize.define('Course', {
        date_init : DataTypes.DATEONLY,
        date_end : DataTypes.STRING(255),
        year : DataTypes.SMALLINT(4),
        semester : DataTypes.SMALLINT(2)
    }, {
        classMethods : {
            associate : function(models) {
                //User.belongsToMany(models.User, {as: 'Friends',through: 'Friends',scope: 'id' })
                //User.hasMany(models.User, {as: 'Friends'})
                //User.hasMany(models.UserGame, {as: 'UsersGame'})
            }
        }
    });

    return Course;
};