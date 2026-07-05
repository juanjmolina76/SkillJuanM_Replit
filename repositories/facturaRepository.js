const conn =
  require('../db/dbconect').conn; /* deberia ser require('../db/dbconect').conn; */

module.exports = {

  async findByOrderId(orderId) {

    const [rows] =
      await conn.query(
        `
        SELECT *
        FROM facturas
        WHERE order_id = ?
        `,
        [orderId]
      );
      console.log("Factura encontrada:", rows[0]);
    return rows[0];
  },

  async save(data) {

    await conn.query(
      `
      INSERT INTO facturas
      (
        order_id,
        numero,
        cae,
        cae_vto
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        data.orderId,
        data.numero,
        data.cae,
        data.caeVto
      ]
    );
  }
};