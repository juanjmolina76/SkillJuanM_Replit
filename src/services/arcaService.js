const afip = require('./arcaClient');
const orderService = require('./orderService');
const facturaRepository =
  require('../repositories/facturaRepository');
  const { ARCA_PTO_VTA, ARCA_CUIT  } = require('../config');


class ArcaService {

  async emitirFactura(orderId) {

    const order =
      await orderService.getOrderById(orderId); /*  ERA    getOrder    getOrderById   */ 

    const ultimo =
      await afip.ElectronicBilling
        .getLastVoucher(ARCA_PTO_VTA, ARCA_CBTE_TIPO);

    const siguiente = ultimo + 1;

    const factura =
      await afip.ElectronicBilling
        .createVoucher({
          CantReg: 1,
          PtoVta: ARCA_PTO_VTA,
          CbteTipo: ARCA_CBTE_TIPO,

          Concepto: 1,
          DocTipo: 99,
          DocNro: 0,

          CbteDesde: siguiente,
          CbteHasta: siguiente,

          CbteFch: parseInt(
            new Date()
              .toISOString()
              .slice(0, 10)
              .replace(/-/g, '')
          ),

          ImpTotal: order.total,
          ImpTotConc: 0,
          ImpNeto: order.total,
          ImpOpEx: 0,
          ImpIVA: 0,
          ImpTrib: 0,

          MonId: 'PES',
          MonCotiz: 1
        });

    await facturaRepository.save({
      orderId,
      numero: siguiente,
      cae: factura.CAE,
      caeVto: factura.CAEFchVto
    });

    return factura;
  }
}

module.exports =
  new ArcaService();