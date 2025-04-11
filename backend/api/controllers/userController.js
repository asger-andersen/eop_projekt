require('dotenv').config({
    path: `${__dirname}/.env`
});
const fetch = require("node-fetch");
const asyncHandler = require('express-async-handler');
const supabase = require('../../db-config');
const bcrypt = require('bcrypt');
const bs58 = require('bs58');
const { Keypair } = require('@solana/web3.js');
const { generateCookie } = require('../cookies/createCookie');



// @desc    Create user
// @route   POST /api/user/create
// @access  Public
const createUser = asyncHandler(async (req, res) => {

    // Destructure request data
    const { user_name, user_phone, user_country, user_password } = req.body;

    // Verify that all required values was passed along in the request
    if (!user_name || !user_phone || !user_password || !user_country) {
        res.status(400).json({ error: "All fields are required." });
        return
    }

    // Generate keypayir
    const privateKey = await generateKeypair();

    // Hash password
    const hashedpassword = await hashPassword(user_password);

    //Create user profile in the database
    const { data, error } = await supabase
        .from('users')
        .insert({
            user_name,
            user_phone,
            user_privatekey: privateKey,
            password_hash: hashedpassword,
            user_country
        })
        .select()

    if (error) {
        console.error(error)
        res.status(400).json({ error: error.message });
    } else {
        res.status(201).json(data);
    }
})



// @desc    Sign in
// @route   POST /api/user/signin
// @access  Public
const signIn = asyncHandler(async (req, res) => {

    // Destructure request data
    const { user_phone, user_password } = req.body;

    // Verify that all required credentials was passed in the request
    if (!user_phone || !user_password) {
        res.status(400).json({ error: "Please provide all credentials" });
        return
    }

    // Fetch user information from database
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq("user_phone", user_phone);

    if (data.length < 1) {
        res.status(401).json({ message: "Credentials do not match!" });
        return
    }

    const userData = data[0]

    // Restructure user data
    console.log(userData)
    //const { password_hash, created_at, ...resturcturedUserInfo } = userData;

    // Compare passwords
    const correctPassword = await comparePassword(user_password, userData.password_hash);

    if (error) {
        res.status(400).json({ error: error.message });
    } else if (!correctPassword) {
        res.status(401).json({ message: "Credentials do not match!" });
    } else {
        // Return response in cookie
        generateCookie({ userid: userData.user_id, json: { user: userData }, res: res, status: 200 })
    }
})



// @desc    Verify user session
// @route   POST /api/user/verify-session
// @access  Private - Note: if no JWT is present, the user simply won't make it to here
const verifySession = asyncHandler(async (req, res) => {

    // Save the user in a variable
    const userInfo = req.user[0]

    // Restructure user info so password is not sent to frontend
    const { password_hash, created_at, ...resturcturedUserInfo } = userInfo;

    if (!resturcturedUserInfo) {
        res.status(400).json({ "Error message": "Falied fetching user" });
    } else {
        // Return user information
        res.status(200).json(resturcturedUserInfo)
    }
})



// @desc    Get all data associated with user
// @route   GET /api/user/getdata
// @access  Private
const getUserData = asyncHandler(async (req, res) => {

    // Save user in variable
    const userInfo = req.user[0]

    console.log(userInfo);

    // Fetch user data from database
    const { data, error } = await supabase
        .from('transactions')
        .select(`
            transaction_id,
            state,
            order_id,
            transaction_amount,
            transaction_currency (
                iso_code
            ),
            receiving_company (
                company_id, 
                company_name, 
                company_website
            ),
            created_at
        `)
        .eq("sending_user", userInfo.user_id)
        .order('created_at', { ascending: false });


    if (error) {
        console.error(error)
        res.status(400).json({ error: error.message });
    } else {
        res.status(200).json(data);
    }
})



// @desc    Generate Keypair for user
//
//
const generateKeypair = async () => {
    try {

        // Generate keypair
        const keypair = Keypair.generate();

        // Convert secretkey to base 58 string
        const privateKey = bs58.default.encode(keypair.secretKey);
        console.log(privateKey)

        return privateKey;

    } catch (error) {
        console.error(error);
        throw error;
    }
};



// @desc    Hash the given password
//
//
const hashPassword = async (password) => {
    try {

        // Generate salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password
        const hash = await bcrypt.hash(password, salt);

        return hash;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



// @desc    Check if the given password match the one in the db
//
//
const comparePassword = async (insertedPassword, hash) => {
    try {

        // Compare passwords
        const result = await bcrypt.compare(insertedPassword, hash)

        return result
    } catch (error) {
        console.error(error);
        throw error;
    }
}



module.exports = {
    createUser,
    signIn,
    verifySession,
    getUserData
}