'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'bases',
            [
                {
                    params: 'demo-param-1',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    params: 'demo-param-2',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('bases', null, {});
    }
};

