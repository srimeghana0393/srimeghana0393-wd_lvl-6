"use strict";
const { Op, where } = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userID",
      });
    }

    //to add a todo item
    static addTodo({ title, dueDate, userID }) {
      return this.create({
        title: title, //title of the todo item
        dueDate: dueDate, //duedate of the todo item 
        completed: false, //status of the todo item 
        userID, //userid of the user creating the todo item
      });
    }

    //get all the todo items of a specific user using id
    static getTodos(userID) {
      return this.findAll({
        where: {
          userID,
        },
      });
    }

    //get all the overdue todo items of a specific user using id
    static async overDue(userID) {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(), //when duedate is less than current date
          },
          userID,
          completed: false,
        },
        order: [["id", "ASC"]], //display in ascending order
      });
    }

    //get all the todo items that are due today of a specific user using id
    static async dueToday(userID) {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(), //when duedate is equal to current date
          },
          userID,
          completed: false,
        },
        order: [["id", "ASC"]], //display in ascending order
      });
    }

    //get all the todo items that are due later of a specific user using id
    static async dueLater(userID) {
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(), //when duedate is greater than current date
          },
          userID,
          completed: false,
        },
        order: [["id", "ASC"]], //display in ascending order
      });
    }
 
    //get all the todo items that are completed of a specific user using id
    static async completedItems(userID) {
      return await Todo.findAll({
        where: {
          completed: true, //when the status is true
          userID,
        },
      });
    }

    //delete
    static async remove(id, userID) {
      return this.destroy({
        where: {
          id,
          userID,
        },
      });
    }

    setCompletionStatus(state) {
      return this.update({ completed: state });
    }
  }
  Todo.init(
    {
      //title of todo
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          len: 5,
        },
      },
      
      //duedate of todo
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: true,
        },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
