import { UUIDV4, Model, DataTypes } from 'sequelize';

class CodaComment extends Model {}

export default (sequelize) => {
    CodaComment.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
        },
        parentId: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        website: DataTypes.STRING,
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        notify: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        sequelize,
        modelName: 'comment',
    });

    return CodaComment;
};
