// const pdf = require("../Requests/pdf");

const express = require("express");
const router = express.Router();
const {
  getTours,
  getTour,
  // getReviewsById,
} = require("../controllers/api.controller");

//localhost:8000/api/get-tours
router.post("/get-tours", getTours); //

//localhost:8000/api/get-tour
router.post("/get-tour", getTour);

//localhost:8000/api/get-meta-data
// router.post("/get-meta-data", api.getMetaData); // [not used]

//localhost:8000/api/get-reviews
// router.post("/get-reviews", getReviewsById);

// router.post("/generate-pdf", pdf.generatePDF);

// // Get All Navigation
// router.get("/", getAllNavigation);

// // Get Navigation by id
// router.get("/:id", getNavigationById);

// // Create Navigation
// router.post("/", navigationValidation, createNavigation);

// // Update Navigation
// router.put("/:id", navigationValidation, updateNavigation);

// // Delete Navigation
// router.delete("/:id", deleteNavigation);

module.exports = router;
