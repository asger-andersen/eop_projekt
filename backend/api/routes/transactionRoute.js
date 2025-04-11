const express = require('express')
const router = express.Router()
const {
    completeTransaction,
    createTransaction,
    cancelTransaction
} = require('../controllers/transactionController.js')
const { protect } = require('../middleware/authMiddleware')

router.put('/complete', protect, completeTransaction)
router.post('/create', createTransaction)
router.put('/cancel', protect, cancelTransaction)

module.exports = router