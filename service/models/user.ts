import { User } from '../database/models';

export default {
    findUserByEmail(email) {
        return User.findOne({ where: { email } });
    },
};
