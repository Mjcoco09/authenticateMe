"use strict";
let options = {};
options.tableName = 'Users'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(options, "firstName", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(options, "lastName", {
      type: Sequelize.STRING,
    }, options);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(options, "firstName");
    await queryInterface.removeColumn(options, "lastName");
  },
};
