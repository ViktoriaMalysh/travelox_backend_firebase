const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const dayjs = require("dayjs");

module.exports.generatePDF = async function (req, res) {
  try {
    const params = {
      country: "France",
      nameHotel: "Travel Hotel",
      checkIn: "2023-01-10",
      checkOut: "2023-01-20",
      adults: "2",
      children: "1",
    };

    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream("receipt.pdf"));

    doc.image("logo-login.png", {
      fit: [150, 150],
      align: "left",
    });

    doc.fontSize(20).font("Helvetica").text("Booking successfully!", {
      align: "center",
      height: 100,
      baseline: -50,
    });

    const table = {
      headers: [
        "Country",
        "Hotel name",
        "Departure date",
        "Arrival date",
        "Adults",
        "Children",
      ],
      rows: [
        [
          params.country,
          params.nameHotel,
          dayjs(params.checkIn).format("MMM D, YYYY h:mm A"),
          dayjs(params.checkOut).format("MMM D, YYYY h:mm A"),
          params.adults,
          params.children,
        ],
      ],
    };

    await doc.table(table, {
      columnsSize: [50, 80, 140, 140, 50, 50],
      y: 200,
      width: 700,
      x: 50,
      divider: {
        header: { disabled: false, width: 2, opacity: 1 },
        horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
      },
      padding: 5,
      columnSpacing: 5,
      hideHeader: false,
      minRowHeight: 0,
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) =>
        doc.font("Helvetica").fontSize(10),
    });

    doc.fontSize(12).font("Helvetica").text("Cost per person: 100$", {
      align: "left",
      height: 100,
      baseline: -40,
    });

    doc.fontSize(12).font("Helvetica").text("Vat: 10$", {
      align: "left",
      height: 100,
      baseline: -45,
    });

    doc.fontSize(12).font("Helvetica").text("Discount: 20$", {
      align: "left",
      height: 100,
      baseline: -50,
    });

    doc.fontSize(12).font("Helvetica").text("Status: paid", {
      align: "left",
      height: 100,
      baseline: -55,
    });

    doc.fontSize(14).font("Helvetica").text("Total: 3100$", {
      align: "left",
      height: 100,
      baseline: -75,
    });

    doc
      .fontSize(12)
      .font("Helvetica")
      .text("Thanks for choosing us, have a nice rest!", {
        align: "center",
        height: 100,
        baseline: -120,
      });

    doc
      .fillColor("blue")
      .text("The link for Travelox website", {
        align: "center",
        height: 100,
        baseline: -130,
      })
      .link(100, 100, 160, 27, "https://myproject-f8190.web.app/");

    doc.end();

    res.status(200).json({ status: "done" });
  } catch (err) {
    console.log("Error: " + err);
    res.status(500).json({ message: err });
  }
};
