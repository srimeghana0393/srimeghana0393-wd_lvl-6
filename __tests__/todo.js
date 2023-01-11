const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
let server, agent;

// to extract csrf token
function extractCsrfToken(response) {
  var $ = cheerio.load(response.text);
  return $("[name=_csrf]").val();
}

//describe function
describe("Checking Todo", function() {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
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

  //Test to create a new todo
  test("Creating a new todo", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res); //gets csrf token
    const response = await agent.post("/todos").send({
      title: "Complete course", //name
      dueDate: new Date().toISOString(), //duedate
      completed: false, //status
      _csrf: csrfToken, //csrf token
    });
    expect(response.statusCode).toBe(302); 
  });

 //Test for marking a todo as complete
  test("To mark a todo as complete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res); //gets csrf token
    await agent.post("/todos").send({
      title: "Assignment submission", //name 
      dueDate: new Date().toLocaleString("en-CA"), //date
      completed: false, //status
      _csrf: csrfToken, //csrf token
    });

    const gropuedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(gropuedTodosResponse.text);
    const duetc = parsedGroupedResponse.dueTodayItems.length;
    const newtodos = parsedGroupedResponse.dueTodayItems[duetc - 1];
    
    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);
   
    console.log(newtodos)
    const markAsCompleteresponse = await agent.put(`/todos/${newtodos.id}`).send({
      _csrf: csrfToken,
    });
    const parsedUpdateResponse = JSON.parse(markAsCompleteresponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });


  //To mark a todo as incomplete
  test("Marking a todo as incomplete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res); //gets csrf token
    await agent.post("/todos").send({
      title: "Incomplete", //name
      dueDate: new Date().toISOString(), //duedate
      completed: true, //status
      _csrf: csrfToken, //csrf token
    });

    const groupedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponsee = JSON.parse(groupedTodosResponse.text);
    //completed items count
    const cIcount = parsedGroupedResponsee.completedItems.length;
    const latestTodoo = parsedGroupedResponsee.completedItems[cIcount - 1];
    const completed = !latestTodoo.completed;
    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);
    
    //mark complete response
    const markcr = await agent
      .put(`/todos/${latestTodoo.id}`)
      .send({
        _csrf: csrfToken,
        completed: completed,
      });

    const parsedUpdateResponses = JSON.parse(markcr.text);
    expect(parsedUpdateResponses.completed).toBe(false);
  });

 
  //Test to delete a todo using id
  test("Deleting a todo", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res); //gets csrf token
    await agent.post("/todos").send({
      title: "Assignment submitted", //name
      dueDate: new Date().toISOString(), //duedate
      completed: false, //status
      _csrf: csrfToken, //csrf token
    });

    const gropuedTodosResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(gropuedTodosResponse.text);
    // duetoday count
    const duetc = parsedGroupedResponse.dueToday.length;
    // latest todos
    const newtodos = parsedGroupedResponse.dueToday[duetc - 1];

    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const response = await agent.put(`todos/${newtodos.id}`).send({
      _csrf: csrfToken,
    });
    const parsedUpdateResponse = JSON.parse(response.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });


  
});