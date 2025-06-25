const pool = require("./config");
const queryObjects = require("./query");

const errorMsg = {
  invalidName: "Full name is invalid, use format 'name surname'",
  invalidAssistant: "Assistant name is invalid, use format 'name surname'",
  invalidAge: "age is invalid, please enter a valid age",
  invalidDate: "date is not valid, use format DD/MM/YYYY",
  invalidTime: "time is not valid, use format HH:MM",
  invalidComment: "invalid comment, please enter a valid comment",
  nonexistentId: "please provide a valid ID",
  noVisitors: "there are no visitors to delete",
  nonexistentVisitor: "Visitor does not exist in database",
  nonexistentColumn: (column) => `"${column}" does not exist in the database`,
  columnNotFound: (column) =>
    `column "${column}" of relation "visitors" does not exist`,
};

const successMsg = {
  tableCreation: "table created successfully",
  visitorCreation: (info) => `Visitor added with ID: ${info}`,
  visitorDeleted: (id) => `Visitor with ID: ${id}, has been deleted`,
  visitorUpdated: (id) => `Visitor with ID; ${id} has been updated`,
  allVisitorsDeleted: "all visitors deleted",
};

function validateId(id) {
  if (!id || (typeof id !== "number" && id < 1)) {
    throw new Error(errorMsg.nonexistentId);
  }
}

const regex = {
  validateName: /^[A-Za-z]+(?: [A-Za-z]+)+$/,
  validateTime: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
};

const isDateValid = (date) => {
  return !isNaN(new Date(date));
};

const inputValidator = ({
  full_name = "valid name",
  visitor_age = 10,
  date_of_visit = "01/01/2020",
  time_of_visit = "12:00",
  assistant_name = "valid name",
  comments = "comment",
}) => {
  if (typeof full_name !== "string" || !regex.validateName.test(full_name)) {
    throw new Error(errorMsg.invalidName);
  }

  if (
    typeof assistant_name !== "string" ||
    !regex.validateName.test(assistant_name)
  ) {
    throw new Error(errorMsg.invalidAssistant);
  }

  if (typeof visitor_age !== "number" || visitor_age < 0) {
    throw new Error(errorMsg.invalidAge);
  }

  if (typeof comments !== "string") {
    throw new Error(errorMsg.invalidComment);
  }

  if (!isDateValid(date_of_visit)) {
    throw new Error(errorMsg.invalidDate);
  }

  if (!regex.validateTime.test(time_of_visit)) {
    throw new Error(errorMsg.invalidTime);
  }
};

const createTable = async () => {
  await pool.query(queryObjects.createTable);
  return successMsg.tableCreation;
};

const addNewVisitor = async (visitor) => {
  const {
    full_name,
    visitor_age,
    date_of_visit,
    time_of_visit,
    assistant_name,
    comments,
  } = visitor;

  inputValidator({
    full_name,
    visitor_age,
    date_of_visit,
    time_of_visit,
    assistant_name,
    comments,
  });

  const values = [
    full_name,
    visitor_age,
    date_of_visit,
    time_of_visit,
    assistant_name,
    comments,
  ];
  const res = await pool.query(queryObjects.addVisitor, values);
  return successMsg.visitorCreation(res.rows[0].id);
};

const listAllVisitors = async () => {
  const res = await pool.query(queryObjects.selectAll);
  return res.rows;
};

const deleteAVisitor = async (id) => {
  validateId(id);
  await viewOneVisitor(id);

  pool.query(queryObjects.deleteOne, [id]);
  return successMsg.visitorDeleted(id);
};

const updateAVisitor = async (id, columnToBeUpdated, newValue) => {
  validateId(id);
  inputValidator({ [columnToBeUpdated]: newValue });
  await viewOneVisitor(id);

  if (!queryObjects.update(columnToBeUpdated)) {
    throw new Error(errorMsg.nonexistentColumn(columnToBeUpdated));
  }

  await pool.query(queryObjects.update(columnToBeUpdated), [newValue, id]);
  return successMsg.visitorUpdated(id);
};

const viewOneVisitor = async (id) => {
  validateId(id);
  const res = await pool.query(queryObjects.viewOne, [id]);
  if (res.rows.length === 0) throw new Error(errorMsg.nonexistentVisitor);
  if (res.rows[0].date_of_visit) {
    res.rows[0].date_of_visit = new Date(res.rows[0].date_of_visit)
      .toISOString()
      .split("T")[0];
  }
  return res.rows;
};

const deleteAllVisitors = async () => {
  const allVisitors = await listAllVisitors();
  if (allVisitors.length === 0) throw new Error(errorMsg.noVisitors);
  await pool.query(queryObjects.deleteAll);
  return successMsg.allVisitorsDeleted;
};

const viewLastVisitor = async () => {
  const res = await pool.query(queryObjects.viewLast);
  return res.rows[0].id;
};

module.exports = {
  addNewVisitor,
  listAllVisitors,
  deleteAVisitor,
  updateAVisitor,
  viewOneVisitor,
  deleteAllVisitors,
  viewLastVisitor,
  errorMsg,
  createTable,
  successMsg,
};
