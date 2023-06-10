// Import required packages and modules
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

// Configure dotenv
dotenv.config();

// Initialize express app
const app = express();

const {
  authRouter,
  // userRouter,
  apiRouter,
  checkoutRouter,
} = require("./routes");
const auth = require("./middlewares/auth");

// const { tokenValidationMiddleware } = require('./middlewares/user');

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
// app.use(apiKeyMiddleware);
const defaultCorsOptions = {
  origin: ["http://localhost:3000", "https://example.com"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Version"],
  optionsSuccessStatus: 200,
  preflightContinue: true,
  credentials: true,
};
app.use("/", cors(defaultCorsOptions));

// dev
app.use(require("morgan")("dev"));

// const PDFDocument = require("pdfkit");
// const doc = new PDFDocument();

// Routes
app.use("/auth", authRouter);
// app.use("/users", userRouter);

app.use("/api", 
// auth,
 apiRouter);

app.use("/checkout", checkoutRouter);
// app.use('/posts', tokenValidationMiddleware, postRouter);

const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export app
module.exports = app;
