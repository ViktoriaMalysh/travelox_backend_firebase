const axios = require("axios");
const X_RapidAPI_Key = process.env.X_RapidAPI_Key;
const X_RapidAPI_URL = process.env.X_RapidAPI_URL;

module.exports.getTours = (req, res) => {
  const data = req.body.data;

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
      console.log(response.data.data.propertySearch.properties)
      res  
        .status(200)
        .json({ tours: response.data.data.propertySearch.properties });
    })
    .catch((error) => {
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
      const images = response.data.data.propertyInfo.propertyGallery.images.map((item)=>{
        return {
          url: item.image.url,
          description: item.image.description
        }
      })
      console.log("[images]:", images)

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

// const a = {
//   incoming: {
//     readable: false,
//     _eventsCount: 0,
//     _maxListeners: undefined,

//     params: {},
//     query: {},

//     body: {
//       method: "get",
//       url: "https://hotels4.p.rapidapi.com/properties/list",
//       params: [Object],
//       headers: [Object],
//     },
//   },
// };
