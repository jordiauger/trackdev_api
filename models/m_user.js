/**
 * New node file
 */

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', {
		name : DataTypes.STRING(255),
		email : DataTypes.STRING(255),
        user_type : DataTypes.SMALLINT(3),
		password : DataTypes.STRING(100),
        user_last_connection: DataTypes.STRING(25),
		registration_code: DataTypes.STRING(255),
		active:DataTypes.TINYINT(1),
        udg_code: DataTypes.STRING(25)
	}, {
		classMethods : {
			associate : function(models) {
				//User.belongsToMany(models.User, {as: 'Friends',through: 'Friends',scope: 'id' })
				//User.hasMany(models.User, {as: 'Friends'})
				//User.hasMany(models.UserGame, {as: 'UsersGame'})
			}
		}
	});

	return User;
};