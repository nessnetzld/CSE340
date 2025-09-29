/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 ***************************************** */
/* ***********************
 * Require Statements
 *********************** */
const inventoryRoute = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities/");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
app.use(express.static("public"));
const static = require("./routes/static");

/* ***********************
 * View Engine and Templates
 * ********************** */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 * ********************** */
app.use(static);
//app.use(require("./routes/static"));
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
// app.get("/", function (req, res) {
//   res.render("index", { title: "Home" });
// });
// Inventory routes
//app.use("/inv", inventoryRoute);
// Inventory routes
app.use("/inv", inventoryRoute);

/* *********************
 * File Not Found Route - must be last route in list
 * Place after all routes
 * ********************** */
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* **************************
 * Express Error Handler
 * Place after all other middleware
 * ************************ */
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 404) {
    message = err.message;
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?";
  }
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 4000;
const host = process.env.HOST || "localhost";

const isProduction = process.env.NODE_ENV === "production";

/* ***********************
 * Log statement to confirm server operation
 *************************/
if (isProduction) {
  app.listen(port, () => {
    console.log(`🚀 App running in production on port ${port}`);
  });
} else {
  app.listen(port, host, () => {
    console.log(`🛠️ App running locally at http://${host}:${port}`);
  });
}
