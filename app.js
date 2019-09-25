// Readymade modules
const http = require("http");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const expressValidator = require("express-validator");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const fs = require('fs');
const https = require('https');

// Created Modules
const config = require("./config");
const Database = require("./DB/database");

// Load dotenv config
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
	// eslint-disable-next-line global-require
	require("dotenv").load();

	if (!process.env.PORT) {
		console.error('Required environment variable not found. Are you sure you have a ".env" file in your application root?');
		console.error('If not, you can just copy "example.env" and change the defaults as per your need.');
		process.exit(1);
	}
}

const app = express();
const server = http.createServer(app);

// var privateKey = fs.readFileSync('/var/www/html/LeaveTracking/ssl/key.pem');
// var certificate = fs.readFileSync('/var/www/html/LeaveTracking/ssl/server.crt');
// var credentials = { key: privateKey, cert: certificate };
// const secureServer = https.createServer(credentials, app);
// secureServer.listen(process.env.PORT);
// console.log(`Server started on Port ${process.env.PORT}`);



app.use(expressSession({
	secret: "1231sdf65s6df4",
	resave: true,
	cookie: {
		sameSite: true,
	},
}));

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// API routes initialise
require("./routes/index")(app);

// Catch 404 errors
// Forwarded to the error handlers
app.use((req, res, next) => {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// Development error handler
// Displays stacktrace to the user
if (app.get("env") === "development") {
	app.use((err, req, res) => {
		res.status(err.status || 500);
		res.render("error", {
			message: err.message,
			error: err,
		});
	});
}

// Production error handler
// Does not display stacktrace to the user
app.use((err, req, res) => {
	res.status(err.status || 500);
	res.render("error", {
		message: err.message,
		error: "",
	});
});


// db configuration
Database.config(
	process.env.NODE_ENV === "production" ? process.env.PROD_ADDRESS : process.env.DEV_ADDRESS,
	process.env.NODE_ENV === "production" ? process.env.PROD_DBNAME : process.env.DEV_DBNAME,
	process.env.NODE_ENV === "production" ? process.env.PROD_USERNAME : process.env.DEV_USERNAME,
	process.env.NODE_ENV === "production" ? process.env.PROD_PASSWORD : process.env.DEV_PASSWORD,
	config && config.databaseOption ? config.databaseOption : undefined,
	(err, message) => {
		if (!err) console.info("Mongodb is connected");
		else console.error(`Mongodb Error:${message}`);
	},
);

server.listen(process.env.PORT || 3000);
console.log(`Server started on port ${process.env.PORT}`);
module.exports = app;
