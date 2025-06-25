const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const { addNewVisitor, createTable } = require("./index");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "../views"));

createTable()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`app is live on port: http://localhost:${PORT}/new_visitor`);
    });
  })
  .catch((err) => {
    console.error("Error during table creation", err);
  });

app.get("/new_visitor", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post("/submit-form", async (req, res) => {
  const {
    visitorName,
    assistantName,
    visitorAge,
    dateOfVisit,
    timeOfVisit,
    comments,
  } = req.body;

  try {
    let id = await addNewVisitor({
      full_name: visitorName,
      visitor_age: Number(visitorAge),
      date_of_visit: dateOfVisit,
      time_of_visit: timeOfVisit,
      assistant_name: assistantName,
      comments: comments,
    });

    id = id.match(/\d+/)[0];

    res.render("thankyou", {
      visitorName,
      assistantName,
      visitorAge,
      dateOfVisit,
      timeOfVisit,
      comments,
      id,
    });
  } catch (err) {
    res.send(err.message);
  }
});
