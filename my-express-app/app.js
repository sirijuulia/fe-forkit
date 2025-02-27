const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors"); // add at the top

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const recipesRouter = require("./routes/recipes"); // import recipes route
const databaseRoutes = require("./routes/databaseRoutes");
const authRouter = require("./routes/auth");

var app = express();

app.use(cors()); // add after 'app' is created
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/recipes", recipesRouter); // Register the recipes API
app.use("/api", databaseRoutes);
app.use("/api/auth", authRouter);

module.exports = app;
