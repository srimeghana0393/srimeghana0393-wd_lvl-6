"use strict";
const { Model, where } = require("sequelize");
const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
    }

    // to add todo items

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    // for completion status

    setCompletionStatus() {
      return this.update({
        completed: !this.completed,
      });
    }
    
    // to get todo list

    static getTodos() {
      const todos = Todo.findAll({
        order: [["id", "ASC"]],
      });
      return todos;
    }
    
    //to get over due items

    static getOverdueItems() {
      const overdueItems = Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
          completed: { [Op.eq]: false },
        },
        order: [["id", "ASC"]],
      });

      return overdueItems;
    }

    // to get items that are due today

    static getDueTodayItems() {
      const dueTodayItems = Todo.findAll({
        where: {
          dueDate: new Date(),
          completed: { [Op.eq]: false },
        },
        order: [["id", "ASC"]],
      });

      return dueTodayItems;
    }
    
    // to get items that are due later
    static getDueLaterItems() {
      const dueLaterItems = Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date() },
          completed: { [Op.eq]: false },
        },
        order: [["id", "ASC"]],
      });

      return dueLaterItems;
    }
    
    // to delete a todo list

    deleteTodo() {
      return this.destroy({
        where: {
          id: this.id,
        },
      });
    }
    
    // to get list of completed todo items

    static getCompletedTodos() {
      return this.findAll({
        where: { completed: { [Op.eq]: true } },
        order: [["id", "DESC"]],
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
