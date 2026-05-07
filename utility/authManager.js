const jwt = require('jsonwebtoken');
const secret = "sipsecretkey123456";
function signJwt(payload){
    try{
        return jwt.sign(payload, secret, {
            expiresIn: '50m'
        });
    }
    catch(error){
        console.log(error);
        return null;
    }
}
function verifyJWT(token){
    try{
        return jwt.verify(token, secret);
    }
    catch(error){
        return null;
    }
}
module.exports = {
    signJwt,
    verifyJWT
};