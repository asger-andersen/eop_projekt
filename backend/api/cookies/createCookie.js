require('dotenv').config({
    path: `${__dirname}/.env`
});
const jwt = require('jsonwebtoken')


// @desc    Create and return cookie
//
//
const generateCookie = async (data) => {

    // Destructure payload
    const { userid, json, res, status } = data

    // Generate JWT
    const token = await generateToken(userid);

    // Cookie options
    const options = {
        httpOnly: true,
        sameSite: 'None',
        secure: true, // Send cookie over HTTP
        expiresIn: (1000 * 60 * 60 * 24),
        maxAge: (1000 * 60 * 60 * 24)
    };

    // Return cookie
    res.status(status)
    res.cookie('jwt', token, options)
    res.json(
        json
    );
}



// @desc    Generate JWT
//
//
const generateToken = async (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}



module.exports = {
    generateCookie
}