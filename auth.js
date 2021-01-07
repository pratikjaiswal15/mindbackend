
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'gygysbdkowufrdq31567189'; // token secret

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization; // get token from auth header

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = authenticateJWT

