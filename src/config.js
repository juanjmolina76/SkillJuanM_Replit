require('dotenv').config();

const PORT = 4000; // en replit pongo const PORT = process.env.PORT || 4000

const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const MERCADOPAGO_API_KEY = process.env.MERCADOPAGO_TOKEN;

module.exports = {
	PORT,
	BASE_URL,
	MERCADOPAGO_API_KEY
};
