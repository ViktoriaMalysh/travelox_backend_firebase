const axios = require("axios");
const X_RapidAPI_Key = process.env.X_RapidAPI_Key;
const X_RapidAPI_URL = process.env.X_RapidAPI_URL;

module.exports.getTours = (req, res) => {
  const data = req.body.data;
  console.log(data);
  const options = {
    method: "POST",
    url: `${X_RapidAPI_URL}list`,
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": String(X_RapidAPI_Key),
      "X-RapidAPI-Host": "hotels4.p.rapidapi.com",
    },
    data: data,
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data.data.propertySearch.properties);
      res
        .status(200)
        .json({ tours: response.data.data.propertySearch.properties });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error });
    });
};

module.exports.getTour = (req, res) => {
  const tour = req.body.tour;

  const optionsGetReviews = {
    method: "POST",
    url: `${X_RapidAPI_URL}detail`,
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": String(X_RapidAPI_Key),
      "X-RapidAPI-Host": "hotels4.p.rapidapi.com",
    },
    data: {
      currency: tour.currency,
      eapid: 1,
      locale: tour.locale,
      siteId: 300000001,
      propertyId: tour.propertyId,
    },
  };

  axios
    .request(optionsGetReviews)
    .then((response) => {
      const images = response.data.data.propertyInfo.propertyGallery.images.map(
        (item) => {
          return {
            url: item.image.url,
            description: item.image.description,
          };
        }
      );
      console.log("[images]:", images);

      const res = response.data.data.propertyInfo.summary;
      const tourDetails = {
        id: res.id,
        name: res.name,
        map: res.map,
        rating: res.overview.propertyRating.rating,
        city: res.location.address.city,
        coordinates: [
          res.location.coordinates.latitude,
          res.location.coordinates.longitude,
        ],
        images: [],
        image: res.staticImage.url,
      };
      res.status(200).json({ tourDetails: tourDetails });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: error });
    });

  // const responseGetReviews = await axios(optionsGetReviews);

  // const ress = {
  //   guestReviews: {
  //     starRating: response.data.data.body.propertyDescription.starRating,
  //     reviewsCount: response.data.data.body.guestReviews.brands.total,
  //     reviews:
  //       responseGetReviews.data.reviewData.guestReviewGroups.guestReviews
  //         .reviews,
  //   },
  //   price: {
  //     currentPrice:
  //       response.data.data.body.propertyDescription.featuredPrice.currentPrice
  //         .formatted,
  //     oldPrice:
  //       response.data.data.body.propertyDescription.featuredPrice.oldPrice,
  //   }
  //   roomTypes: response.data.data.body.propertyDescription.roomTypeNames,

  // };
};

// [not used]

// module.exports.getMetaData = (req, res) => {
//   const options = {
//     method: "GET",
//     url: "https://hotels4.p.rapidapi.com/v2/get-meta-data",
//     headers: {
//       "X-RapidAPI-Key": String(X_RapidAPI_Key),
//       "X-RapidAPI-Host": "hotels4.p.rapidapi.com",
//     },
//   };

//   axios
//     .request(options)
//     .then((response) => {
//       console.log(response.data);

//       const destination = result.data.map((item) => {
//         return { text: item.name, value: item.name, key: item.hcomLocale };
//       });

//       res.status(200).json({ destination: destination });
//     })
//     .catch((error) => {
//       // console.error(error);
//       res.status(500).json({ message: error });
//     });
// };

module.exports.getReviewsById = async function (req, res) {
  try {
    const config = req.body;

    const result = await axios(config);

    const reviews =
      result.data.reviewData.guestReviewGroups.guestReviews[0].reviews;

    res.status(200).json({ reviews: reviews });
  } catch (err) {
    console.log("Error: " + err);
    res.status(500).json({ message: "Server have some problem" });
  }
};

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
