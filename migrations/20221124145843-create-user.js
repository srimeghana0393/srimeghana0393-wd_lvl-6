"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    //table for users info
    await queryInterface.createTable("Users", {
      //id of user
      id: {
        allowNull: false, // do not allow empty
        autoIncrement: true,
        primaryKey: true, //acts as a primary key
        type: Sequelize.INTEGER, //type - number
      },

      //first name of the user
      firstName: {
        type: Sequelize.STRING, //type - string
      },
      
      //last name of the user
      lastName: {
        type: Sequelize.STRING, //type - string
      },

      //email of the user
      email: {
        type: Sequelize.STRING, //type - string
        allowNull: false, // do not allow empty
        unique: true, //should be unique
      },

      //password 
      password: {
        type: Sequelize.STRING, //type - string
      },

      // date when created
      createdAt: {
        allowNull: false, //do not allow empty
        type: Sequelize.DATE, //type - date
      },

      //date when updated
      updatedAt: {
        allowNull: false, //do not allow empty
        type: Sequelize.DATE, // type - date
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
