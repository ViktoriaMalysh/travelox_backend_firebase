const axios = require("axios");
const X_RapidAPI_Key = process.env.X_RapidAPI_Key;

module.exports.getTours = async function (req, res) {
	try {
		const config = req.body;

		const response = await axios(config);

		const tours = response.data.data.body.searchResults.results;

		res.status(200).json({ tours: tours });
	} catch (err) {
		console.log("Error: " + err);
		res.status(500).json({ message: "Server have some problem" });
	}
};

module.exports.getTour = async function (req, res) {
	try {
		const config = req.body;
		const id = config.params.id;

		const optionsGetPhoto = {
			method: "get",
			url: "https://hotels4.p.rapidapi.com/properties/get-hotel-photos",
			params: { id: id },
			headers: {   
				"X-RapidAPI-Key": String(X_RapidAPI_Key),
				"X-RapidAPI-Host": "hotels4.p.rapidapi.com",
			},
		};

		const optionsGetReviews = {
			method: "GET",
			url: "https://hotels4.p.rapidapi.com/reviews/list",
			params: { id: "1178275040", page: "1", loc: "en_US" },
			headers: {
				"X-RapidAPI-Key": X_RapidAPI_Key,
				"X-RapidAPI-Host": "hotels4.p.rapidapi.com",
			},
		};

		const response = await axios(config);

		const responseGetPhoto = await axios(optionsGetPhoto);
		const responseGetReviews = await axios(optionsGetReviews);

		const photos = responseGetPhoto.data.hotelImages.map((item) => {
			var re = /{size}/gi;
			var str = item.baseUrl;
			var newstr = str.replace(re, "w");
			return newstr;
		});

		const ress = {
			hotelId: response.data.data.body.pdpHeader.hotelId,
			photos: photos,
			nameHotel: response.data.data.body.propertyDescription.name,
			guestReviews: {
				starRating: response.data.data.body.propertyDescription.starRating,
				reviewsCount: response.data.data.body.guestReviews.brands.total,
				reviews:
					responseGetReviews.data.reviewData.guestReviewGroups.guestReviews
						.reviews,
			},
			price: {
				currentPrice:
					response.data.data.body.propertyDescription.featuredPrice.currentPrice
						.formatted,
				oldPrice:
					response.data.data.body.propertyDescription.featuredPrice.oldPrice,
			},
			countryName:
				response.data.data.body.propertyDescription.address.countryName,
			countryCode:
				response.data.data.body.propertyDescription.address.countryCode,
			cityName: response.data.data.body.propertyDescription.address.cityName,
			fullAddress:
				response.data.data.body.propertyDescription.address.fullAddress,
			currencyCode: response.data.data.body.pdpHeader.currencyCode,
			coordinates: _.values(response.data.data.body.pdpHeader.hotelLocation.coordinates),
			roomTypes: response.data.data.body.propertyDescription.roomTypeNames,
			postalCode:
				response.data.data.body.propertyDescription.address.postalCode,
		};

		res.status(200).json({ tourDetails: ress });
	} catch (err) {
		console.log("Error: " + err);
		res.status(500).json({ message: "Server have some problem" });
	}
};

module.exports.getMetaData = async function (req, res) {
	try {
		const config = req.body;

		const result = await axios(config);   

		const locale = result.data.map((item) => {
			return { text: item.name, value: item.name, key: item.hcomLocale };
		});

		res.status(200).json({ locale: locale });
	} catch (err) {
		console.log("Error: " + err);
		res.status(500).json({ message: "Server have some problem" });
	}
};

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
