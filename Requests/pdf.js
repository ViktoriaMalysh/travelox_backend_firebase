const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const dayjs = require("dayjs");

module.exports.generatePDF = async function (req, res) {
  try {
    const params = {
      userName: "Ruth Burke",
      courseName: "SEXUAL INTEGRITY 101",
      date: dayjs("2023-01-12").format("MMMM D, YYYY"),
    };

    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream("receipt.pdf"));

    doc.image("download.png", 0, 0, { width: 615, height: 615 });

    doc
      .fontSize(40)
      .font("Helvetica-Bold")
      .fillColor("darkslategray")
      .text(params.userName, {
        align: "center",
        height: 100,
        baseline: -275,
        characterSpacing: 0.5,
      });

    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("darkcyan")
      .text(`FOR THE COMLETION OF THE COURSE: "${params.courseName}"`, {
        align: "center",
        height: 100,
        baseline: -250,
        characterSpacing: 0.5,
      });

    doc
      .fontSize(15)
      .font("Helvetica-Bold")
      .fillColor("darkcyan")
      .text(params.date, {
        align: "center",
        height: 100,
        baseline: -311,
        characterSpacing: 0.5,
      });

    doc.end();

    res.status(200).json({ status: "done" });
  } catch (err) {
    console.log("Error: " + err);
    res.status(500).json({ message: err });
  }
};
