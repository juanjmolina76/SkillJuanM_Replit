//const pool = require('../db/connection');
//const pool = require('../db/dbconnect');/*Agrego conexion a la base de datos*/
const { conn } = require('../db/dbconnect')

async function createOrderFromCart(userId) {
  //const connection = await pool.getConnection();
    const connection = await conn.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Obtener último carrito
    const [[cartRow]] = await connection.query(
      'SELECT MAX(id) as cartId FROM cart WHERE user_id = ?',
      [userId]
    );

    if (!cartRow.cartId) {
      throw new Error("No hay carrito activo");
    }

    const cartId = cartRow.cartId;

    // 2️⃣ Obtener items del carrito
    const [items] = await connection.query(
      'SELECT * FROM cart_items WHERE cart_id = ?',
      [cartId]
    );

    if (items.length === 0) {
      throw new Error("Carrito vacío");
    }

    // 3️⃣ Traer precios reales
    const productIds = items.map(i => i.product_id);

    const [productos] = await connection.query(
      `SELECT id, precio AS price, nombre 
       FROM producto 
       WHERE id IN (?)`,
      [productIds]
    );

    const productosMap = {};
    productos.forEach(p => {
      productosMap[p.id] = p;
    });

    // 4️⃣ Calcular total real
    let total = 0;
    const mpItems = [];

    for (const item of items) {
      const producto = productosMap[item.product_id];

      if (!producto) {
        throw new Error("Producto no encontrado");
      }

      const unitPrice = Number(producto.price);
      const quantity = Number(item.quantity);
      const subtotal = unitPrice * quantity;

      total += subtotal;

      mpItems.push({
        title: producto.nombre,
        quantity,
        unit_price: unitPrice,
        currency_id: "ARS"
      });
    }

    if (isNaN(total)) {
      throw new Error("Total inválido");
    }

    // 5️⃣ Crear orden
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total, status)
       VALUES (?, ?, 'pending')`,
      [userId, total]
    );

    const orderId = orderResult.insertId;

    // 6️⃣ Crear order_items
    for (const item of items) {
      const producto = productosMap[item.product_id];

      const unitPrice = Number(producto.price);
      const quantity = Number(item.quantity);
    // 7️⃣ Insertar order_items
      await connection.query(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, price, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          quantity,
          unitPrice,
          unitPrice * quantity
        ]
      );
    }
      // ✅ 8️⃣ Confirmar todo
    await connection.commit();

    return {
      orderId,
      mpItems,
      total
    };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}


async function updateOrderStatus(orderId, status) {
  await conn.query(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [status, orderId]
  );
}


async function savePreferenceId(orderId, preferenceId) { //¿es lo mismo preferenceId que response.id es el id de la preferencia que devuelve MercadoPago?
  await conn.query(
    `UPDATE orders SET preference_id = ? WHERE id = ?`,
    [preferenceId, orderId]
  );
}

async function savePayment(paymentData) {

  await conn.query(
    `INSERT INTO payments (
      order_id,
      user_id,
      mp_preference_id,
      mp_payment_id,
      mp_merchant_order_id,
      status,
      status_detail,
      payment_method,
      payment_type,
      transaction_amount
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      paymentData.order_id,
      paymentData.user_id,
      paymentData.preference_id,
      paymentData.payment_id,
      paymentData.merchant_order_id,
      paymentData.status,
      paymentData.status_detail,
      paymentData.payment_method,
      paymentData.payment_type,
      paymentData.transaction_amount
    ]
  );
}

async function getOrderById(orderId) {
  const [rows] = await conn.query(
    `SELECT id, user_id, total, status, date FROM orders WHERE id = ?`, //AGREGADO para la confirmacion de payment 
    [orderId]
  );

  if (!rows.length) {
    throw new Error("Orden no encontrada");
  }

  return rows[0];
}

async function paymentExists(paymentId) {
  const [rows] = await conn.query(
    `SELECT id FROM payments WHERE mp_payment_id = ?`,
    [paymentId]
  );
  return rows.length > 0;
}


module.exports = {
  createOrderFromCart,
  updateOrderStatus,
  savePreferenceId,
  savePayment,
  getOrderById,
  paymentExists
  
};