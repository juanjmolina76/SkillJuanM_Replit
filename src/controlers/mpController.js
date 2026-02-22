const {MercadoPagoConfig, Preference} = require ('mercadopago');
const { BASE_URL, MERCADOPAGO_API_KEY } = require ('../config.js')
	
const client = new MercadoPagoConfig({
		accessToken: MERCADOPAGO_API_KEY
	});

const order = new Preference(client);