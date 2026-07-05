require('dotenv').config();

const { Arca, ElectronicBillingService } = require('@arcasdk/core');

const core = new Arca({
  cuit: Number(process.env.ARCA_CUIT),
  production: process.env.ARCA_PRODUCTION === 'true'
});

/**
 * Crear servicio de facturación correctamente
 */
const electronicBilling = new ElectronicBillingService(core);

module.exports = {
  core,
  electronicBilling
};