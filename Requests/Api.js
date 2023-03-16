const axios = require("axios");
const { reviewsList } = require("../config");
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
            console.log(response.data.data.propertySearch.properties);
            res.status(200).json({
                tours: response.data.data.propertySearch.properties,
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: error });
        });
};

module.exports.getTour = async (req, res) => {
    const data = req.body.data;

    let images;
    let reviews;
    let result;

    const optionsGetImages = {
        method: "POST",
        url: `${X_RapidAPI_URL}detail`,
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": String(X_RapidAPI_Key),
            "X-RapidAPI-Host": "hotels4.p.rapidapi.com",
        },
        data: data,
    };

    const optionsGetReviews = {
        method: "POST",
        url: `https://hotels4.p.rapidapi.com/reviews/v3/list`,
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": String(X_RapidAPI_Key),
            "X-RapidAPI-Host": "hotels4.p.rapidapi.com",
        },
        data: {
            currency: data.currency,
            eapid: data.eapid,
            locale: data.locale,
            siteId: data.siteId,
            propertyId: data.propertyId,
            size: 10,
            startingIndex: 0,
        },
    };

    try {
        result = await axios.request(optionsGetImages);
        images = result.data.data.propertyInfo.propertyGallery.images.map(
            (item) => {
                return {
                    url: item.image.url,
                    description: item.image.description,
                };
            }
        );
        result = result.data.data.propertyInfo.summary;

        // reviews = await axios.request(optionsGetReviews);

        // const totalCount =
        //     reviews.data.data.propertyInfo.reviewInfo.summary.totalCount.raw;
        // reviews = reviews.data.data.propertyInfo.reviewInfo.reviews.map(
        //     (item) => {
        //         return {
        //             text: item.text,
        //             submissionTimeLocalized: item.submissionTimeLocalized,
        //         };
        //     }
        // );

        const tourDetails = {
            id: result.id,
            name: result.name,
            map: result.map,
            rating: result.overview.propertyRating.rating,
            city: result.location.address.city,
            coordinates: [
                result.location.coordinates.latitude,
                result.location.coordinates.longitude,
            ],
            images: images,
            imageMap: result.location.staticImage.url,
            addressLine: result.location.address.addressLine,
            reviews: reviewsList,
            // type: response.data.data.propertyInfo.reviewInfo.reviews[0].brandType,
            // totalCount: totalCount,
            totalCount: Math.floor(Math.random() * (500 - 100)) + 100
        };
        return res.status(200).json({ tourDetails: tourDetails });
    } catch (exeption) {
        console.error("[exeption]", exeption);
        return res.status(500).json({ message: exeption });
    }

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
