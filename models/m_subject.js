

module.exports = function(sequelize, DataTypes) {

	var Subject = sequelize.define('Subject', {
		name : DataTypes.STRING(255),
		subject_code : DataTypes.STRING(255)
	}, {
		classMethods : {
			associate : function(models) {

			}
		}
	});

	return Subject;
};