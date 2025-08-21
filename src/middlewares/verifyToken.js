import jwt from "jsonwebtoken";
import config from "../config/config.js"

const verifyToken = (req, res, next) =>{
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  //var token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }
  jwt.verify(token, config.secretKey, function(err, decoded) {   
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    
    }
    req.id = decoded.id;
    next();
  });
}

export default verifyToken;