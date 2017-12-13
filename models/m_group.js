/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {

    var Group = sequelize.define('Group', {
        name : DataTypes.STRING(255),
        repository_url : DataTypes.STRING(255),

    }, {
        classMethods : {
            associate : function(models) {

            }
        }
    });

    return Group;
};