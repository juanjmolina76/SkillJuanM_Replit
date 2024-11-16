const mysql = require('mysql2')

const pool = mysql.createPool ({      // PARA TRABAJAR EN MI COMPUTADORA :
    host: 'mysql-skilljm.alwaysdata.net', //localhost
    user: 'skilljm', //root
    password: 'Skill_JM1976#$', //admin
    database: 'skilljm_04', //testing
    port: '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
})

module.exports = {
    conn: pool.promise()
}
