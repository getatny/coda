module.exports = {
    up: async (queryInterface, Sequelize) => queryInterface.createTable('comments', {
        id: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        postId: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        parentId: {
            type: Sequelize.DataTypes.UUID,
            allowNull: true,
        },
        email: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        nickname: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        website: Sequelize.DataTypes.STRING,
        content: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        notify: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
        },
        createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
        },
    }),

    down: async (queryInterface) => queryInterface.dropTable('comments'),
};
