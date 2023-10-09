"use strict";
<<<<<<< HEAD
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
=======

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "firstName", {
      type: Sequelize.STRING,
    }, options);
    await queryInterface.addColumn("users", "lastName", {
>>>>>>> dev
      type: Sequelize.STRING,
    }, options);
  },
<<<<<<< HEAD
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(options, "firstName");
    await queryInterface.removeColumn(options, "lastName");
=======
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "firstName", options);
    await queryInterface.removeColumn("users", "lastName", options);
>>>>>>> dev
  },
};
