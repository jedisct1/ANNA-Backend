'use strict';


const marked = require('marked');
const compileMd = (mission, options) => {
    mission.description = marked(mission.markdown);
};


module.exports = (sequelize, DataTypes) => {

    const Mission = sequelize.define('Mission', {

        
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },

        
        markdown: {
            allowNull: true,
            type: DataTypes.STRING,
            set (val) {
                this.setDataValue('markdown', val); // Set this field with the raw markdown
                this.setDataValue('description', marked(val));
            }
        },

        
        description: {
            allowNull: true,
            type: DataTypes.STRING
        },

        
        budgetAssigned: {
            allowNull: true,
            type: DataTypes.INTEGER
        },

        budgetUsed: {
            allowNull: true,
            type: DataTypes.INTEGER
        },

        groupId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },

        leaderId: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: true,
        hooks: {
            beforeCreate: compileMd,
            beforeUpdate: compileMd
        }
    });

    
    Mission.associate = function (models) {

        
        Mission.belongsTo(models.Group, {
            foreignKey: 'groupId',
            as: 'group',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });

        
        Mission.belongsTo(models.User, {
            foreignKey: 'leaderId',
            as: 'leader',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });
        Mission.hasMany(models.Task, {
            as: 'tasks',
            foreignKey: 'missionId',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });
        Mission.belongsToMany(models.User, {
            as: 'members',
            foreignKey: 'missionId',
            through: models.UserMission,
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });
    };

    return Mission;
};
