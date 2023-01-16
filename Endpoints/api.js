const express = require("express");
const router = express.Router();
const api = require("../Requests/Api");

//localhost:8000/api/get-tours
router.post("/get-tours", api.getTours); //

//localhost:8000/api/get-tour
router.post("/get-tour", api.getTour); 

//localhost:8000/api/get-meta-data
// router.post("/get-meta-data", api.getMetaData); // [not used]

//localhost:8000/api/get-reviews
router.post("/get-reviews", api.getReviewsById); 

router.post("/generate-pdf", api.generatePDF); 

module.exports = router;
