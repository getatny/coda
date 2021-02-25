import { Model, DataTypes, UUIDV4 } from 'sequelize';

class User extends Model {}

export default (sequelize) => {
    User.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'user',
    });

    return User;
};
