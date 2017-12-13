module.exports = function(sequelize, DataTypes) {

    var Study = sequelize.define('Study', {
        mark:DataTypes.SMALLINT,
    }, {
        classMethods : {
            associate : function(models) {
                Study.belongsTo(models.Subject, {as:'subject', foreignKey : 'subject_id'})
                Study.belongsTo(models.User, {as:'user', foreignKey : 'user_id'})
                Study.belongsTo(models.Group, {as:'group', foreignKey : 'group_id'})
                Study.belongsTo(models.Course, {as:'course', foreignKey : 'course_id'})
            }
        }
    });

    return Study;
};