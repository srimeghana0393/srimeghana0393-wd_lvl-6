"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // create table for todo
    await queryInterface.createTable("Todos", {
      
      // for id of list
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      // for title of list
      title: {
        type: Sequelize.STRING,
      },

      // for duedate of list
      dueDate: {
        type: Sequelize.DATEONLY,
      },

      // for completion status of list
      completed: {
        type: Sequelize.BOOLEAN,
      },

      // for create at a date
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      // for update at a date
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Todos");
  },
};
