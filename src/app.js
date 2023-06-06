const express = require("express");
const app = express();
require("dotenv").config();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded());

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(require("morgan")("dev"));

const api = require("./Endpoints/api");
const user = require("./Endpoints/user");
const reservation = require("./Endpoints/reservation");

// const PDFDocument = require("pdfkit");
// const doc = new PDFDocument();

app.use("/api", api);

app.use("/reservation", reservation);

app.use("/", user);

module.exports = app;
