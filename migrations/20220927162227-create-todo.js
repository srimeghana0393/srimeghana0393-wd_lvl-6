"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //table for todo items
    await queryInterface.createTable("Todos", {
      //id of todo
      id: {
        allowNull: false, // do not allow empty
        autoIncrement: true,
        primaryKey: true, //acts as a primary key
        type: Sequelize.INTEGER, //type - number
      },

      //title of the todo item
      title: {
        type: Sequelize.STRING, //type - string
      },

      //due date for the todo item
      dueDate: {
        type: Sequelize.DATEONLY, //type - only date
      },

      //status of the todo item
      completed: {
        type: Sequelize.BOOLEAN, //type - true or false
      },

      //todo item created on
      createdAt: {
        allowNull: false, //do not allow empty
        type: Sequelize.DATE, //type - date
      },

      //todo item update on 
      updatedAt: {
        allowNull: false, //do not allow empty
        type: Sequelize.DATE, //type - date
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Todos");
  },
};
