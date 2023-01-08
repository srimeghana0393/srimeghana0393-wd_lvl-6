"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //create a table for todos in database
    await queryInterface.createTable("Todos", {
      //id
      id: {
        allowNull: false, //do not allow empty
        autoIncrement: true, 
        primaryKey: true, //id acts as primary key
        type: Sequelize.INTEGER, //type - number
      },
      //title
      title: {
        type: Sequelize.STRING, //type - string
      },
      // duedate for an item 
      dueDate: {
        type: Sequelize.DATEONLY, //type - only date
      },
      //completed status of an item
      completed: {
        type: Sequelize.BOOLEAN, //type - true or false
      },
      //when the item is created
      createdAt: {
        allowNull: false, //do not allow empty
        type: Sequelize.DATE, //type - date
      },
      //when the item is updated
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
