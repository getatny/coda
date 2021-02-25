import { Model, DataTypes } from 'sequelize';

class Post extends Model {}

export default (sequelize) => {
    Post.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'post',
    });

    return Post;
};
