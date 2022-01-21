const mysql = require("mysql"); // Import the needed mysql database for the authentifiaction feature

// create mysql database
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "exo_justify_text",
});

// connect to the database
con.connect(function (error) {
  if (!error) {
    console.log("connected successfully to the database");
  } else {
    console.log(error);
  }
});

module.exports = con;
