const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

//for login
const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username, //email
    password: password, //password
    _csrf: csrfToken, //csrf token
  });
};

// describe function for a todo application
describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  //test for sign up
  test("Sign-up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "First name", //first name of the user
      lastName: "User A", //last name of the user
      email: "namelastname@gmail.com", //email of the user
      password: "PASSWORD", //password the user want to set up 
      _csrf: csrfToken, //csrf token
    });
    expect(res.statusCode).toBe(302); //https request
  });

  //test for sign out
  test("Sign-out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  //test that creates a todo and responds with json at /todos POST endpoint
  test("Creating a todo", async () => {
    const agent = request.agent(server);
    await login(agent, "namelastname@gmail.com", "PASSWORD");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res); //get csrf token
    const response = await agent.post("/todos").send({
      title: "Complete course", //name of todo item
      dueDate: new Date().toISOString(), //duedate
      completed: false, //status
      _csrf: csrfToken, //csrf token
    });
    expect(response.statusCode).toBe(302);
  });

  // test that marks a todo with the given ID as complete
  test("Marking a todo as complete", async () => {
    const agent = request.agent(server);
    await login(agent, "namelastname@gmail.com", "PASSWORD");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res); //get csrf token
    await agent.post("/todos").send({
      title: "Complete course", //name
      dueDate: new Date().toISOString(), //date
      completed: false, //status
      _csrf: csrfToken, //csrf token
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    // due today count
    const dtcount = parsedGroupedResponse.dueToday.length;
    //latest todo
    const newtodo = parsedGroupedResponse.dueToday[dtcount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    //mark complete response
    const markcr = await agent
      .put(`/todos/${newtodo.id}`)
      .send({
        _csrf: csrfToken,
        completed: true,
      });
    const parsedUpdateResponse = JSON.parse(markcr.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  //test that Marks a todo with the given ID as incomplete
  test("Marking a todo as incomplete", async () => {
    const agent = request.agent(server);
    await login(agent, "namelastname@gmail.com", "PASSWORD"); //user must login
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res); //get csrf token
    await agent.post("/todos").send({
      title: "Complete Assignment", //name
      dueDate: new Date().toISOString(), // duedate
      completed: true, //status
      _csrf: csrfToken, //csrf token
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    // due today count
    const dtcount = parsedGroupedResponse.dueToday.length;
    const newtodo = parsedGroupedResponse.dueToday[dtcount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markcr = await agent
      .put(`/todos/${newtodo.id}`)
      .send({
        _csrf: csrfToken,
        completed: false,
      });
    const parsedUpdateResponse = JSON.parse(markcr.text);
    expect(parsedUpdateResponse.completed).toBe(false);
  });

  //test that deletes a todo with the given ID if it exists and sends a boolean response
  test("Deleting a todo send a boolean response", async () => {
    const agent = request.agent(server);
    await login(agent, "namelastname@gmail.com", "PASSWORD"); //user must login
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res); //gets csrf token
    await agent.post("/todos").send({
      title: "Complete course", //name
      dueDate: new Date().toISOString(), //duedate
      completed: false, //status
      _csrf: csrfToken, //csrf token
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");

    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    // due today count
    const dtcount = parsedGroupedResponse.dueToday.length;
    const newtodo = parsedGroupedResponse.dueToday[dtcount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const todoID = newtodo.id;
    const deleteresponse = await agent.delete(`/todos/${todoID}`).send({
      _csrf: csrfToken,
    });
    const parsedDeleteResponse = JSON.parse(deleteresponse.text).success;
    expect(parsedDeleteResponse).toBe(true);

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const deleteresponse2 = await agent.delete(`/todos/${todoID}`).send({
      _csrf: csrfToken,
    });
    const parsedDeleteResponse2 = JSON.parse(deleteresponse2.text).success;
    expect(parsedDeleteResponse2).toBe(false);
  });
});
