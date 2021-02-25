module.exports = {
    up: async (queryInterface, Sequelize) => queryInterface.createTable('users', {
        id: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        email: {
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

    down: async (queryInterface) => queryInterface.dropTable('users'),
};
