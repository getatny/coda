import fse from 'fs-extra';
import path from 'path';
import { Sequelize } from 'sequelize';
import initCommentModel from './comment';
import initPostModel from './post';
import initUserModel from './user';

const env = process.env.NODE_ENV || 'development';
const config: any = fse.readJSONSync(path.resolve(__dirname, '../..', 'configs', 'database.json'))[env];

// eslint-disable-next-line import/no-mutable-exports
let sequelize;
if (config.user_env_variable) {
    sequelize = new Sequelize(process.env[config.user_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const CodaComment = initCommentModel(sequelize);
const Post = initPostModel(sequelize);
initUserModel(sequelize);

// 关联
Post.comments = Post.hasMany(CodaComment);

export default sequelize;
