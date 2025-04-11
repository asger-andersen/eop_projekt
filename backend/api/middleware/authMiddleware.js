require('dotenv').config({
    path: `${__dirname}/.env`
});
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const supabase = require('../../db-config');

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.cookie) {
        try {
            const cookies = req.headers.cookie.split(';')

            for (let cookie of cookies) {

                if (cookie.startsWith(' ')) {
                    cookie = cookie.split(' ').join('')
                }

                if (cookie.startsWith('jwt')) {
                    token = cookie.split('=')[1]

                    //Verify token
                    const decoded = jwt.verify(token, process.env.JWT_SECRET)

                    //Get user from the token
                    const { data, error } = await supabase
                        .from('users')
                        .select()
                        .eq("user_id", decoded.id)

                    if (error) {
                        throw new Error(error.message);
                    } else {
                        req.user = data
                    }
                }
            }

            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

module.exports = {
    protect
}