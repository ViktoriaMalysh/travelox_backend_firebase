const keys = require("../keys/keys");
const { User, PaymentCards, UserPaymentCards } = require("../sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.create = async function (req, res) {
	try {
    const { firstName, lastName, email, password } = req.body.user;
    
    // accommodation: accommodation,
    // dayOfArrival: dayOfArrival,
    // dayOfDeparture: dayOfDeparture,
    // state: 'reserved',
    // travellers: travellers,
    // user: user ? user : null,
    // hostReserved: false,

			await User.sync({ alter: true });

			const salt = bcrypt.genSaltSync(10);
			const bcryptPassword = bcrypt.hashSync(password, salt);

			const new_user = await User.create({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: bcryptPassword,
			});    
			await new_user.save();

			const token = jwt.sign(
				{
					email: email,
					password: bcryptPassword,
					id: new_user.dataValues.id,
				},
				keys.jwt,
				{ expiresIn: 300 }
			);

			res.status(200).json({
				token: token,

				userDetails: {
					id: new_user.dataValues.id,
					firstName: new_user.dataValues.firstName,
					lastName: new_user.dataValues.lastName,
					email: new_user.dataValues.email,
				},
			});
		
	} catch (err) {
		console.log("[Error]: " + err);
		res.status(500).json({
			message: err,
		});
	}
};