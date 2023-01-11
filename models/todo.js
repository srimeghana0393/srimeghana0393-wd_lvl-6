"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {

    static associate(models) {
    }
    //add a todo
    static addaTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false }); //creates a todo with title, duedate, and completed status
    }
    
    //gets list of all todos
    static getAllTodos() {
      return this.findAll({ order: [["id", "ASC"]] }); //gets list of all todos in ascending order
    }

    //list of completed items
    static async completedItemsAre() {
      return this.findAll({
        where: { completed: { [Op.eq]: true } }, //when completed status is true
        order: [["id", "DESC"]], //display in descending order
      });
    }

    //to remove an item in todo 
    static async remove(id) {
      return this.destroy({ 
        where: {
          id, //using an id
        },
      });
    }
    
    //modify completed status 
    setCompletionStatusAs(bool) {
      return this.update({ completed: bool }); //update completed status
    }

    //list of overdues
    static async overdue() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"), //when duedate is less than today's date
          },
          completed: false, //and status is false
        },
        order: [["id", "ASC"]], // display in ascending order
      });
    }

    //list of items that are due today
    static async dueToday() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toLocaleDateString("en-CA"), //when due date is equal to todays date
          },
          completed: false, //and status is false
        },
        order: [["id", "ASC"]], //display in ascending order
      });
    }

    //items that are due later
    static async dueLater() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"), //when due date is equal to todays date
          },
          completed: false, //and status is false
        },
        order: [["id", "ASC"]], //display in ascending order
      });
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING, 
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
