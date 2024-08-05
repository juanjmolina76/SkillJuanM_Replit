const mysql = require('mysql2')

const pool = mysql.createPool ({
    host: 'mysql-skilljm.alwaysdata.net',
    user: 'skilljm',
    password: 'Skill_JM1976#$',
    database: 'skilljm_04',
    port: '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

module.exports = {
    conn: pool.promise()
}
