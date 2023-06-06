const keys = require("../keys/keys");
const { User, PaymentCards, UserPaymentCards } = require("../models/sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const stripe = require("stripe")(
    "sk_test_51KUSyrKfW2ml5zvjWfV8DDFPisAct25UPDDvkQqRkEWWimpAf11u3wE08axcmZxTU1PgVObUMw0lvtDi9tW2kOgc00MnuxCRNu"
);

module.exports.createCheckoutSession = async (req, res) => {
    try {
        const { id, cancelUrl, successUrl, amount , images} = req.body;

        const product = await stripe.products.create({
            name: id,
			images: [],
            default_price_data: { unit_amount: amount * 100, currency: "usd" },
            expand: ["default_price"],
        });

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: product.default_price.id,
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${successUrl}&success=true`,
            cancel_url: `${cancelUrl}&canceled=true`,
        });

        res.status(200).json({ status: "success", url: session.url });
    } catch (exeption) {
        console.log("[Error]: " + exeption);
        return res.status(500).json({
            message: exeption,
        });
    }
};
