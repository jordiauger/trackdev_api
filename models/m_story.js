module.exports = function(sequelize, DataTypes) {

    var Story = sequelize.define('Story', {
        story_points:DataTypes.SMALLINT,
        description:DataTypes.TEXT,
        status:DataTypes.SMALLINT,
        name: DataTypes.STRING(255)
    }, {
        classMethods : {
            associate : function(models) {
                Story.belongsTo(models.Sprint, {as:'sprint', foreignKey : 'sprint_id'})
                Story.belongsTo(models.User, {as:'userAssigned', foreignKey : 'user_assigned'})
                Story.belongsTo(models.Group, {as:'group', foreignKey : 'group_id'})
            }
        }
    });

    return Story;
};