// Middleware para verificar si el usuario es admin (id_rol = 1 ó 3 )
function isAdmin(req, res, next) {
    if (req.session && req.session.user && (req.session.user.id_rol === 1 || req.session.user.id_rol === 3  )) {
        return next();
    }
    res.status(403).send("Acceso denegado: solo para administradores.");
}

//Middleware para verificar si el usuario es SuperAdmin (id_rol = 3)
function isSuperAdmin(req, res, next) {
    
    if (req.session && req.session.user && req.session.user.id_rol === 3 ){
        return next();
    }
    console.log("Acceso denegado: id_rol =", req.session?.user?.id_rol);

    res.status(403).send("Acceso denegado: solo para el SuperAdministrador.");  
}

module.exports = { isAdmin, isSuperAdmin};