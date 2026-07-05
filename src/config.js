require('dotenv').config();

const PORT = 4000; // en replit pongo const PORT = process.env.PORT || 4000

const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const MERCADOPAGO_API_KEY = process.env.MERCADOPAGO_TOKEN;

const ARCA_CUIT = process.env.ARCA_CUIT;
const ARCA_PTO_VTA = process.env.ARCA_PTO_VTA;
const ARCA_PRODUCTION = process.env.ARCA_PRODUCTION === 'true';	
const ARCA_CBTE_TIPO = 11; // Tipo de comprobante para factura C


module.exports = {
	PORT,
	BASE_URL,
	MERCADOPAGO_API_KEY,
	ARCA_CUIT,
	ARCA_PTO_VTA,
	ARCA_PRODUCTION,
	ARCA_CBTE_TIPO
};

