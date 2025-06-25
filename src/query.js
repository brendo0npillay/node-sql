const queryObjects = {
  createTable: `CREATE TABLE IF NOT EXISTS visitors (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      visitor_age INT NOT NULL,
      date_of_visit DATE NOT NULL,
      time_of_visit TIME NOT NULL,
      assistant_name VARCHAR(255) NOT NULL,
      comments TEXT
  )`,
  addVisitor: `
          INSERT INTO visitors (full_name, visitor_age, date_of_visit, time_of_visit, assistant_name, comments) VALUES
          ($1, $2, $3, $4, $5, $6)
          RETURNING id;
      `,
  selectAll: "SELECT id, full_name FROM visitors",
  deleteOne: "DELETE FROM visitors WHERE id = $1",
  update: (columnToBeUpdated) => `
          UPDATE visitors
          SET ${columnToBeUpdated} = $1
          WHERE id = $2
      `,
  viewOne: "SELECT * FROM visitors WHERE id = $1",
  deleteAll: "DELETE FROM visitors",
  viewLast: "SELECT id FROM visitors ORDER BY id DESC LIMIT 1",
};

module.exports = queryObjects;
