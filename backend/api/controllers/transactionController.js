require('dotenv').config({
    path: `${__dirname}/.env`
})
const fetch = require("node-fetch");
const asyncHandler = require('express-async-handler')
const supabase = require('../../db-config');
const bs58 = require('bs58');
const {
    Connection,
    PublicKey,
    Keypair,
    sendAndConfirmTransaction,
    Transaction,
} = require('@solana/web3.js');
const {
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction,
    TOKEN_PROGRAM_ID,
} = require('@solana/spl-token');


// @desc    Complete transaction
// @route   PUT /api/transaction/complete
// @access  Private
const completeTransaction = asyncHandler(async (req, res) => {
    try {
        // Save data for transaction
        const { to_company, transaction_amount, transaction_id } = req.body;

        // Store user info from sending user - Note: User info is passed from authMiddleware
        const sendingUser = req.user

        // Fetch user data from recieving user
        const recievingCompany = await getCompanyFromDB(to_company);

        // Restore sendingUser keypair
        const sendingUserKeypairBytes = bs58.default.decode(sendingUser[0].user_privatekey);
        const sendingUserKeypair = Keypair.fromSecretKey(sendingUserKeypairBytes);

        // Restore sendingUser keypair
        const recievingUserKeypairBytes = bs58.default.decode(recievingCompany[0].company_privatekey);
        const recievingUserKeypair = Keypair.fromSecretKey(recievingUserKeypairBytes);

        // Restore feePayer keypair
        const feePayerKeypairBytes = bs58.default.decode(process.env.FEEPAYER_PRIVATEKEY);
        const feePayerKeypair = Keypair.fromSecretKey(feePayerKeypairBytes);

        // Establish connection
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        // EURC mint address
        const EURC_MINT = new PublicKey(process.env.EURC_MINT);

        // Exchange DKK value with EUR value - Reformat input
        const amount = exchangeDKKforEUR(transaction_amount)

        // Initiate transfer
        const initiateTransfer = await transferEURC(connection, EURC_MINT, amount, sendingUserKeypair, recievingUserKeypair, feePayerKeypair);

        if (initiateTransfer) {
            // Update the transaction state
            const { data, error } = await supabase
                .from('transactions')
                .update({
                    signature: initiateTransfer,
                    state: "completed"
                })
                .eq("transaction_id", transaction_id)
                .select();

            if (error) {
                console.error(error)
                res.status(400).json({ error: error.message });
            } else {
                res.status(201).json(data);
            }
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: error.message });
    }
})



// @desc    Create pending transaction
// @route   POST /api/transaction/create
// @access  Public
const createTransaction = asyncHandler(async (req, res) => {
    try {
        // Save data for transaction
        const { from_company, order_id, to_user_phone, transaction_amount, transaction_currency } = req.body;

        // Fetch user data from recieving user
        const recievingUser = await getUserFromDBbyPhone(to_user_phone);

        if (recievingUser) {
            // Create pending transaction in DB
            const { data, error } = await supabase
                .from('transactions')
                .insert({
                    order_id,
                    transaction_amount,
                    transaction_currency,
                    receiving_company: from_company,
                    sending_user: recievingUser[0].user_id
                })
                .select()

            if (error) {
                console.error(error)
                res.status(400).json({ error: error.message });
            } else {
                res.status(201).json(data);
            }
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: error.message });
    }
});



// @desc    Cancel pending transaction
// @route   PUT /api/transaction/cancelpending
// @access  Private
const cancelTransaction = asyncHandler(async (req, res) => {
    try {
        // Store user info from sending user - Note: User info is passed from authMiddleware
        const sendingUser = req.user

        // Save data for transaction
        const { transaction_id } = req.body;

        if (!sendingUser || !transaction_id) {
            res.status(400).json({ error: "Please provide all information" });
            return
        }

        // Create pending transaction in DB
        const { data, error } = await supabase
            .from('transactions')
            .update({
                state: "cancelled"
            })
            .match({
                transaction_id: transaction_id,
                sending_user: sendingUser[0].user_id,
            })
            .select();

        if (error) {
            console.error(error)
            res.status(400).json({ error: error.message });
        } else {
            res.status(204).json(data);
        }

    } catch (error) {
        console.error(error)
        res.status(400).json({ error: error.message });
    }
})



// @desc    Validate transaction_amount input
//
// 
const exchangeDKKforEUR = (input) => {

    // Exchange DKK for EUR - Exchange rate is 746,47
    //const amountInEUR = input / 746.47
    const formattedEUR = Math.round(parseFloat(String(input).replace(',', '.')) * 10_000);

    return formattedEUR
};



// @desc    Grab user from database
//
//
const getCompanyFromDB = async (company_id) => {
    const { data, error } = await supabase
        .from('companies')
        .select()
        .eq("company_id", company_id);

    if (error) {
        return error.message
    } else {
        return data
    }
};



// @desc    Grab user from database - search by phone
//
//
const getUserFromDBbyPhone = async (user_phone) => {
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq("user_phone", user_phone);

    if (error) {
        return error.message
    } else {
        return data
    }
};



// @desc    Transfer EURC
//
//
const transferEURC = async (connection, EURC_mint, amount, sendingUserKeypair, recievingUserKeypair, feePayerKeypair) => {
    try {
        // Get or create token accounts for sending and recieving tokens in wallets
        const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            feePayerKeypair, // feePayer
            EURC_mint,
            sendingUserKeypair.publicKey
        );

        const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            feePayerKeypair, // feePayer
            EURC_mint,
            recievingUserKeypair.publicKey
        );

        // Create transfer instruction
        const transferIx = createTransferInstruction(
            senderTokenAccount.address,
            receiverTokenAccount.address,
            sendingUserKeypair.publicKey,
            amount,
            [],
            TOKEN_PROGRAM_ID
        );

        // Create and send transaction
        const tx = new Transaction().add(transferIx);
        tx.feePayer = feePayerKeypair.publicKey;

        const signature = await sendAndConfirmTransaction(connection, tx, [sendingUserKeypair, feePayerKeypair]);

        if (signature) {
            console.log('Transfer confirmed, signature:', signature);
            return signature;
        }
    } catch (error) {
        console.error('Transfer failed:', error);
    }
};



module.exports = {
    completeTransaction,
    createTransaction,
    cancelTransaction
};