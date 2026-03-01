const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    // Leer el token del header
    const token = req.header("x-auth-token");
    
    if (!token) {
        return res.status(401).json("No hay token, permiso denegado");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardamos el payload (id y role) en el request
        next();
    } catch (error) {
        res.status(401).json("Token no es válido");
    }
};
