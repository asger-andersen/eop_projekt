require('dotenv').config({
    path: `${__dirname}/.env`
});
const fetch = require("node-fetch");
const asyncHandler = require('express-async-handler');
const supabase = require('../../db-config');
const bs58 = require('bs58');
const { Keypair } = require('@solana/web3.js');



// @desc    Create company
// @route   POST /api/company/create
// @access  Public
const createCompany = asyncHandler(async (req, res) => {

    // Destructure request data
    const { company_name, company_cvr, company_website, company_country } = req.body;

    // Verify that all required values was passed along in the request
    if (!company_name || !company_cvr || !company_website || !company_country) {
        res.status(400).json({ error: "All fields are required." });
        return
    }

    // Generate keypayir
    const privateKey = await generateKeypair();

    //Create company profile in the database
    const { data, error } = await supabase
        .from('companies')
        .insert({
            company_name,
            company_cvr,
            company_website,
            user_privatekey: privateKey,
            company_country
        })
        .select()

    if (error) {
        console.error(error)
        res.status(400).json({ error: error.message });
    } else {
        res.status(201).json(data);
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



module.exports = {
    createCompany
}