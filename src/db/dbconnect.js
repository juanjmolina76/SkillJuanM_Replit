// carga variables del .env solo en desarrollo local (solo si NO está en producion)
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const mysql = require('mysql2')

const password = process.env.DB_PASSWORD?.replace(/^['"]|['"]$/g, '');

console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  passwordLength: process.env.DB_PASSWORD?.length,
});



const pool = mysql.createPool ({    
    
    host: process.env.DB_HOST, //localhost
    user: process.env.DB_USER, ///root
    password: password, //admin
    database: process.env.DB_NAME, //testing
    port: process.env.DB_PORT, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    //multipleStatements: true //para pedidos query multiples 
});

module.exports = {
    conn: pool.promise()
}
