module.exports = function(sequelize, DataTypes) {

    var Sprint = sequelize.define('Sprint', {
        date_init:DataTypes.DATE,
        date_end:DataTypes.DATE,
        status:DataTypes.TINYINT,
    }, {
        classMethods : {
            associate : function(models) {
                Sprint.belongsTo(models.Course, {as:'course', foreignKey : 'course_id'})
                Sprint.hasMany(models.Story, {as: 'stories'})
            }
        }
    });

    return Sprint;
};