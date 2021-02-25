module.exports = {
    up: async (queryInterface, Sequelize) => queryInterface.createTable('posts', {
        id: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: Sequelize.DataTypes.STRING,
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

    down: async (queryInterface) => queryInterface.dropTable('posts'),
};
