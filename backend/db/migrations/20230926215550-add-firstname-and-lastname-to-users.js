"use strict";

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "firstName", {
      type: Sequelize.STRING,
    }, options);
    await queryInterface.addColumn("users", "lastName", {
      type: Sequelize.STRING,
    }, options);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "firstName", options);
    await queryInterface.removeColumn("users", "lastName", options);
  },
};
