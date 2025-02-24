require("dotenv").config();
const mysql = require("mysql2");
const fs = require("fs");

const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "";
const DB_NAME = process.env.DB_NAME || "fork_it";

// creación de la conexión
const connectDB = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  multipleStatements: true
});

// verificación de la conexión
connectDB.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
    return;
  }
  console.log("Connected to MySQL!");

  // comprobar si la tabla `calendar` ya existe para evitar reinicializar la base de datos
  connectDB.query("SHOW TABLES LIKE 'calendar';", function (err, results) {
    if (err) {
      console.error("Error checking tables:", err.message);
      return;
    }

    if (results.length === 0) {
      console.log("No tables found, initializing database...");
      let sql = fs.readFileSync(__dirname + "/init_db.sql").toString();
      connectDB.query(sql, function (err) {
        if (err) console.error("Error initializing database:", err.message);
        else console.log("Database initialized successfully!");
      });
    } else {
      console.log("Database already set up, skipping initialization.");
    }
  });
});


module.exports = connectDB;
