const express = require('express');
const router = express.Router();
const { isAdmin, isSuperAdmin } = require('../validations/authMiddleware');
const loginController = require('../controlers/loginController');
const { conn } = require('../db/dbconnect')

// Ruta para mostrar el formulario de creación de admin (solo SuperAdmin)
router.get('/crear-admin', isSuperAdmin, (req, res) => {
    res.render('crear-admin');
});

// Ruta para procesar la creación de admin (solo SuperAdmin)
router.post('/crear-admin', isSuperAdmin, loginController.crearAdmin); //no encuentra crearAdmin en controllers loginController

// Ruta para listar usuarios (solo admins)
router.get('/usuarios', isAdmin, async (req, res) => {
    try {
        const [users] = await conn.query('SELECT id, username, email, id_rol FROM usuario');
        res.render('usuarios', {
            users: users,
            isSuperAdmin: req.session.user.id_rol === 3 // Pasar si el usuario es SuperAdmin
        });
    } catch (err) {
        res.status(500).send("Error al cargar usuarios.");
    }
});

router.post('/usuarios/update-rol', isSuperAdmin, async (req, res) => {
    const { userId, newRol } = req.body;

    // Validar que newRol sea 1, 2 o 3
    if (![1, 2, 3].includes(parseInt(newRol))) {
        return res.status(400).send("Rol no válido.");
    }

    try {
        await conn.query(
            'UPDATE usuario SET id_rol = ? WHERE id = ?',
            [newRol, userId]
        );
        res.redirect('/admin/usuarios');// ojo era /admin/usuarios 
    } catch (err) {
        res.status(500).send("Error al actualizar el rol.");
    }
});


module.exports = router;