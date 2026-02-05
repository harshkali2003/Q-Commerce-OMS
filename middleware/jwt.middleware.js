const jwt = require("jsonwebtoken");
require("dotenv").config();

const key = process.env.JWT_SECRET_KEY;

function generateToken(payload){
    return jwt.sign(payload , key , {"expiresIn" : "15d"})
}

function verifyToken(req , resp , next){
    const authenticated = req.headers.authorization;
    if(!authenticated){
        return resp.status(401).json({message : "Token not found"})
    }

    const token = authenticated.split(" ")[1];
    if(!token){
        return resp.status(401).json({message : "Token is invalid or expired"})
    }

    const decoded = jwt.verify(token , key)

    req.user = decoded;

    next();
}

module.exports = {generateToken , verifyToken};