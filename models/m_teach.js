module.exports = function(sequelize, DataTypes) {

    var Teach = sequelize.define('Teach', {
    }, {
        classMethods : {
            associate : function(models) {
                Teach.belongsTo(models.Subject, {as:'subject', foreignKey : 'subject_id'})
                Teach.belongsTo(models.User, {as:'user', foreignKey : 'user_id'})
                Teach.belongsTo(models.Course, {as:'course', foreignKey : 'course_id'})
                //User.hasMany(models.User, {as: 'Friends'})
                //User.hasMany(models.UserGame, {as: 'UsersGame'})
            }
        }
    });

    return Teach;
};