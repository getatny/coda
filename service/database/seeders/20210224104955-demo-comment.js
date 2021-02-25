const faker = require('faker');
const uuid4 = require('uuid4');

module.exports = {
    up: async (queryInterface) => {
        const unPassComments = Array.from({ length: 20 }, () => ({
            id: uuid4(),
            email: faker.internet.email(),
            website: faker.internet.url(),
            nickname: faker.name.firstName(0),
            content: faker.lorem.sentence(),
            status: 1,
            postId: '519198aa7087322fd7cd9f5b8819a2b1',
            notify: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const passComments = Array.from({ length: 20 }, () => ({
            id: uuid4(),
            email: faker.internet.email(),
            website: faker.internet.url(),
            nickname: faker.name.firstName(0),
            content: faker.lorem.sentence(),
            status: 0,
            postId: '519198aa7087322fd7cd9f5b8819a2b1',
            notify: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        return queryInterface.sequelize.transaction((t) => Promise.all([
            queryInterface.bulkInsert('posts', [{
                title: '测试页面',
                url: 'http://localhost:4444/demo/comment-demo.html',
                id: '519198aa7087322fd7cd9f5b8819a2b1',
                createdAt: new Date(),
                updatedAt: new Date(),
            }], { transaction: t }),
            queryInterface.bulkInsert('comments', [...unPassComments, ...passComments], { transaction: t }),
        ]));
    },

    down: async (queryInterface) => queryInterface.sequelize.transaction((t) => Promise.all([
        queryInterface.bulkDelete('comments', null, { transaction: t }),
        queryInterface.bulkDelete('posts', null, { transaction: t }),
    ])),
};
