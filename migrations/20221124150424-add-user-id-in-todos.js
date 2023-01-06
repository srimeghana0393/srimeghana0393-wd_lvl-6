"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Todos", "userID", { 
      //adds a todo item in the table for specific user
      type: Sequelize.DataTypes.INTEGER,
    });

    await queryInterface.addConstraint("Todos", { 
      fields: ["userID"],
      type: "foreign key",
      references: {
        table: "Users",
        field: "id",
      },
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Todos", "userID");
    //removes a todo item for a specific user
  },
};
